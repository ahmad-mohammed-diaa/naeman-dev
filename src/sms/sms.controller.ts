import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterDto } from 'src/auth/dto/auth-register-dto';
import { SmsSwagger } from './sms.swagger';

@ApiTags('SMS')
@Controller('v1/sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @SmsSwagger.create()
  @UseInterceptors(FileInterceptor('file', multerConfig('avatars')))
  @Post()
  create(
    @Body() body: RegisterDto & { type?: 'register' | 'reset' },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.smsService.sendVerificationCode(body);
  }

  @SmsSwagger.resetPassword()
  @Post('password-reset')
  resetPassword(@Body('phone') phone: string) {
    return this.smsService.sendResetPassword(phone);
  }

  @SmsSwagger.verifyCode()
  @UseInterceptors(FileInterceptor('file', multerConfig('avatars')))
  @Post('/verify')
  verifyCode(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.smsService.verifyCode(body, file);
  }

  @SmsSwagger.verifyResetCode()
  @Post('/verify-reset')
  verifyResetCode(
    @Body()
    body: {
      phone: string;
      code: string;
      password: string;
      confirmPassword: string;
    },
  ) {
    return this.smsService.verifyResetCode(body);
  }

  @SmsSwagger.resendRegistrationCode()
  @Post('/resend-register-code')
  resendRegistrationCode(@Body('phone') phone: string) {
    return this.smsService.reSendRegistrationOTP(phone);
  }

  @SmsSwagger.resendResetPasswordCode()
  @Post('/resend-reset-password-code')
  resendResetPasswordCode(@Body('phone') phone: string) {
    return this.smsService.reSendResetPasswordOTP(phone);
  }
}
