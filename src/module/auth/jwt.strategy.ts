import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import { AppUnauthorizedException } from '@/common/exceptions/app.exception';
import {
  getAdmin,
  getBarber,
  getCashier,
  getClient,
} from '@/common/helpers/user.helper';

export interface JwtPayload {
  sub: string;
  phone: string;
  roleName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // Verify access token exists in DB — invalidated on logout
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token) {
      const record = await this.prisma.token.findUnique({
        where: { token },
      });
      if (!record) throw new AppUnauthorizedException();
    }
    const role = payload.roleName;
    const isRoleExists = await this.prisma.roles.findUnique({
      where: { name: role },
    });
    if (!isRoleExists) throw new AppUnauthorizedException();
    if (role === 'CLIENT') {
      return getClient(this.prisma, payload.sub);
    } else if (role === 'BARBER') {
      return getBarber(this.prisma, payload.sub);
    } else if (role === 'CASHIER') {
      return getCashier(this.prisma, payload.sub);
    } else if (role === 'ADMIN') {
      return getAdmin(this.prisma, payload.sub);
    }

    return null;
  }
}
