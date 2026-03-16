import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { OtpService } from './services/otp.service';
import { LogoutService } from './services/logout.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LoginService,
    RegisterService,
    OtpService,
    LogoutService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
