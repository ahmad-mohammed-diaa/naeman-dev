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
import { SmsSwagger } from './sms.swagger';
import { SendSmsDto } from './dto/send-sms.dto';
import { VerifyResetCodeBodyDto } from './dto/verify-reset-code-body.dto';

@ApiTags('SMS')
@Controller('v1/sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @SmsSwagger.create()
  @UseInterceptors(FileInterceptor('file', multerConfig('avatars')))
  @Post()
  create(
    @Body() body: SendSmsDto,
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
  verifyResetCode(@Body() body: VerifyResetCodeBodyDto) {
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
