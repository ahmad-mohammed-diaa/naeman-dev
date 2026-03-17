import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ConflictException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth-login-dto';
import { RegisterDto } from './dto/auth-register-dto';
import { AuthGuard } from 'guard/auth.guard';
import { UserData } from 'decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../src/config/multer.config';
import { AppSuccess } from 'src/utils/AppSuccess';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guard/role.guard';
import { AuthSwagger } from './auth.swagger';
import {
  ChangePasswordDto,
  ReferralCodeCheckDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthSwagger.signup()
  @Post('/signup')
  @UseInterceptors(FileInterceptor('file', multerConfig('avatars')))
  signup(
    @Body() createAuthDto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.signup(createAuthDto, file);
  }

  @AuthSwagger.login()
  @Post('/login')
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }

  @AuthSwagger.logout()
  @Post('/logout')
  @UseGuards(AuthGuard())
  logout(@UserData('token') token: string) {
    return this.authService.logout(token);
  }

  @AuthSwagger.checkReferralCode()
  @Post('/referral-code')
  checkReferralCode(@Body() body: ReferralCodeCheckDto) {
    const isCodeValid = this.authService.checkReferralCode(body.referralCode);
    if (!isCodeValid) {
      throw new ConflictException('Referral Code is not valid');
    }
    return new AppSuccess(
      { referralCode: isCodeValid },
      'Referral Code is Applying',
    );
  }

  @AuthSwagger.changePassword()
  @UseGuards(AuthGuard())
  @Patch('/change-password/:id')
  changePassword(@Param('id') id: string, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(id, body.password);
  }

  @AuthSwagger.resetPassword()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(['ADMIN', 'CASHIER'])
  @Patch('/reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.phone);
  }
}
