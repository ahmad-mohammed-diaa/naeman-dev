import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  LoginResponseDto,
  OtpResponseDto,
  MessageResponseDto,
} from './dto/responses/auth-response.dto';

export const AuthSwagger = {
  login: () =>
    ApiDoc({
      extraModels: [LoginDto, LoginResponseDto],
      summary: 'Login',
      body: LoginDto,
      res: {
        ok: LoginResponseDto,
        unauthorized: { message: 'Invalid phone or password' },
      },
    }),
  register: () =>
    ApiDoc({
      extraModels: [RegisterDto, LoginResponseDto],
      summary: 'Register',
      body: RegisterDto,
      consumes: 'multipart/form-data',
      res: {
        ok: LoginResponseDto,
        conflict: { message: 'Phone number already registered' },
        notFound: { message: 'Branch not found' },
        badRequest: { message: 'Role not found' },
      },
    }),
  logout: () =>
    ApiDoc({
      summary: 'Logout — invalidates current session token',
      auth: true,
      res: {
        ok: MessageResponseDto,
        unauthorized: { message: 'Not authenticated' },
      },
    }),
  refresh: () =>
    ApiDoc({
      summary: 'Refresh access token using refresh token',
      body: RefreshTokenDto,
      res: {
        ok: LoginResponseDto,
        unauthorized: { message: 'Invalid or expired refresh token' },
      },
    }),
  sendOtp: () =>
    ApiDoc({
      extraModels: [SendOtpDto, OtpResponseDto],
      summary: 'Send OTP',
      body: SendOtpDto,
      res: { ok: OtpResponseDto, notFound: { message: 'User not found' } },
    }),
  verifyOtp: () =>
    ApiDoc({
      extraModels: [VerifyOtpDto, MessageResponseDto],
      summary: 'Verify OTP',
      body: VerifyOtpDto,
      res: { ok: MessageResponseDto },
    }),
  forgotPassword: () =>
    ApiDoc({
      summary: 'Forgot password - send reset OTP',
      body: SendOtpDto,
      res: { ok: OtpResponseDto, notFound: { message: 'User not found' } },
    }),
  resetPassword: () =>
    ApiDoc({
      extraModels: [ResetPasswordDto, MessageResponseDto],
      summary: 'Reset password',
      body: ResetPasswordDto,
      res: {
        ok: MessageResponseDto,
        badRequest: { message: 'Invalid or expired reset token' },
      },
    }),
};
