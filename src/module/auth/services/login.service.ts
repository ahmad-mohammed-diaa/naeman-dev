import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../jwt.strategy';
import { comparePassword } from '../../../common/helpers/lib';
import { AppUnauthorizedException } from '../../../common/exceptions/app.exception';

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'refresh_secret';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone, deleted: false },
      include: { roleRef: true },
    });

    if (!user) throw new AppUnauthorizedException('AUTH_INVALID_CREDENTIALS');

    await comparePassword(dto.password, user.password);

    // Check client ban
    if (user.roleRef.name === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { id: user.id },
      });
      if (client?.ban) throw new AppUnauthorizedException('CLIENT_BANNED');
    }

    return this.createTokenPair(user.id, user.phone, user.roleRef.name);
  }

  async createTokenPair(userId: string, phone: string, roleName: string) {
    const payload: JwtPayload = { sub: userId, phone, roleName };
    const access_token = this.jwt.sign(payload, { expiresIn: '1d' });
    const refresh_token = this.jwt.sign(payload, {
      expiresIn: '7d',
      secret: REFRESH_SECRET,
    });

    await this.prisma.token.create({
      data: {
        userId,
        accessToken: access_token,
        token: access_token,
        refreshToken: refresh_token,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { access_token, refresh_token };
  }
}
