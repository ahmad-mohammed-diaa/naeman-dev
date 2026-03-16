import {
  Body,
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthSwagger } from './auth.swagger';
import { UploadFile } from '@/common/decorators/upload.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthSwagger.login()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @AuthSwagger.register()
  @UploadFile('avatar')
  @Post('register')
  register(@UploadedFile() file: { buffer: Buffer }, @Body() dto: RegisterDto) {
    return this.authService.register(dto, file);
  }

  @AuthSwagger.logout()
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Headers('authorization') auth: string) {
    const token = auth?.replace(/^Bearer\s+/i, '') ?? '';
    return this.authService.logout(token);
  }

  @AuthSwagger.refresh()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @AuthSwagger.sendOtp()
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @AuthSwagger.verifyOtp()
  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @AuthSwagger.forgotPassword()
  @Post('forgot-password')
  forgotPassword(@Body() dto: SendOtpDto) {
    return this.authService.sendResetOtp(dto);
  }

  @AuthSwagger.resetPassword()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
