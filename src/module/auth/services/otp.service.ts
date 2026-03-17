import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import {
  AppBadRequestException,
  AppNotFoundException,
} from '../../../common/exceptions/app.exception';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone } = dto;
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await this.prisma.phoneVerification.upsert({
      where: { phone },
      update: { code, expiredAt },
      create: { phone, code, expiredAt },
    });

    // TODO: integrate SMS gateway — return code in dev only
    return {
      message: 'OTP sent',
      ...(process.env.NODE_ENV !== 'production' && { code }),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = await this.prisma.phoneVerification.findUnique({
      where: { phone: dto.phone },
    });

    if (!record || record.code !== dto.code) {
      throw new AppBadRequestException('AUTH_OTP_INVALID');
    }
    if (record.expiredAt < new Date()) {
      throw new AppBadRequestException('AUTH_OTP_EXPIRED');
    }

    await this.prisma.phoneVerification.delete({ where: { phone: dto.phone } });
    return { message: 'Phone verified' };
  }

  async sendResetOtp(dto: SendOtpDto) {
    const { phone } = dto;
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (!user) throw new AppNotFoundException('NOT_FOUND_USER');

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.resetPassword.upsert({
      where: { phone },
      update: { code, expiredAt },
      create: { phone, code, expiredAt },
    });

    return {
      message: 'Reset OTP sent',
      ...(process.env.NODE_ENV !== 'production' && { code }),
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { phone, code, newPassword } = dto;
    const record = await this.prisma.resetPassword.findUnique({
      where: { phone },
    });

    if (!record || record.code !== code) {
      throw new AppBadRequestException('AUTH_RESET_INVALID');
    }
    if (record.expiredAt < new Date()) {
      throw new AppBadRequestException('AUTH_RESET_EXPIRED');
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { phone },
        data: { password: hash },
      }),
      this.prisma.resetPassword.delete({ where: { phone } }),
    ]);

    return { message: 'Password reset successfully' };
  }
}
