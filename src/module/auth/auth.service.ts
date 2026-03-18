import { Injectable } from '@nestjs/common';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { OtpService } from './services/otp.service';
import { LogoutService } from './services/logout.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly otpService: OtpService,
    private readonly logoutService: LogoutService,
  ) {}

  login(dto: LoginDto) { return this.loginService.login(dto); }
  register(dto: RegisterDto, file?: { buffer: Buffer }) { return this.registerService.register(dto, file); }
  logout(accessToken: string) { return this.logoutService.logout(accessToken); }
  refresh(dto: RefreshTokenDto) { return this.logoutService.refresh(dto); }
  sendOtp(dto: SendOtpDto) { return this.otpService.sendOtp(dto); }
  verifyOtp(dto: VerifyOtpDto) { return this.otpService.verifyOtp(dto); }
  sendResetOtp(dto: SendOtpDto) { return this.otpService.sendResetOtp(dto); }
  resetPassword(dto: ResetPasswordDto) { return this.otpService.resetPassword(dto); }
  checkReferralCode(code: string) { return this.registerService.checkReferralCode(code); }
}
