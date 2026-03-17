import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashedPassword } from '@/common/helpers/lib';
import { RegisterDto } from '../dto/register.dto';
import {
  AppConflictException,
  AppNotFoundException,
} from '@/common/exceptions/app.exception';
import { CloudinaryService } from '@/common/cloudinary/cloudinary.service';
import { LoginService } from './login.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loginService: LoginService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async register(dto: RegisterDto, file?: { buffer: Buffer }) {
    const { phone, password, referralCode } = dto;
    const exists = await this.prisma.user.findUnique({ where: { phone } });
    if (exists) throw new AppConflictException('CONFLICT_USER');

    const clientRole = await this.prisma.roles.findUnique({
      where: { name: 'CLIENT' },
    });
    if (!clientRole) throw new AppNotFoundException('NOT_FOUND_ROLE');

    const hash = await hashedPassword(password);

    // Referral handling
    let referredBy: string | null = null;
    if (referralCode) {
      const referrer = await this.prisma.client.findUnique({
        where: { referralCode },
      });
      if (referrer) referredBy = referrer.id;
    }

    let avatarUrl: string | undefined;
    let avatarPublicId: string | undefined;
    if (file) {
      const uploaded = await this.cloudinary.upload(file.buffer, 'avatars');
      avatarUrl = uploaded.url;
      avatarPublicId = uploaded.publicId;
    }

    try {
      const user = await this.prisma.$transaction(async (tx: PrismaService) => {
        const created = await tx.user.create({
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            password: hash,
            roleId: clientRole.id,
            ...(avatarUrl && { avatar: avatarUrl }),
            client: {
              create: {
                referralCode: this.generateReferralCode(),
              },
            },
          },
          include: { roleRef: true },
        });

        // Award referral points to referrer
        if (referredBy) {
          const settings = await tx.settings.findFirst();
          const referralPoints = settings?.referralPoints ?? 1000;

          await tx.client.update({
            where: { id: referredBy },
            data: { points: { increment: referralPoints } },
          });
          await tx.pointTransaction.create({
            data: {
              clientId: referredBy,
              type: 'REFERRAL',
              amount: referralPoints,
            },
          });
        }

        return created;
      });

      return this.loginService.createTokenPair(
        user.id,
        user.phone,
        user.roleRef.name,
      );
    } catch (err) {
      if (avatarPublicId) await this.cloudinary.delete(avatarPublicId);
      throw err;
    }
  }

  private generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
