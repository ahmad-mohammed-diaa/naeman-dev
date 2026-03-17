import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AppUnauthorizedException } from '@/common/exceptions/app.exception';
import { LoginService } from './login.service';

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'refresh_secret';

@Injectable()
export class LogoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly loginService: LoginService,
  ) {}

  async logout(accessToken: string) {
    await this.prisma.token.deleteMany({ where: { accessToken } });
    return { message: 'Logged out successfully' };
  }

  async refresh(dto: RefreshTokenDto) {
    // Verify signature
    let payload: { sub: string; phone: string; roleName: string };
    try {
      payload = this.jwt.verify(dto.refresh_token, { secret: REFRESH_SECRET });
    } catch {
      throw new AppUnauthorizedException('AUTH_INVALID_CREDENTIALS');
    }

    // Check DB
    const record = await this.prisma.token.findFirst({
      where: { refreshToken: dto.refresh_token },
    });
    if (!record || record.expiredAt < new Date()) {
      throw new AppUnauthorizedException('AUTH_INVALID_CREDENTIALS');
    }

    // Delete old token, issue new pair
    await this.prisma.token.delete({ where: { id: record.id } });

    return this.loginService.createTokenPair(
      payload.sub,
      payload.phone,
      payload.roleName,
    );
  }
}
