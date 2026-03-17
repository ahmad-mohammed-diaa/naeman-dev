import { ApiDoc } from '../common/decorators/api-doc.decorator';
import { LoginDto } from './dto/auth-login-dto';
import { RegisterDto } from './dto/auth-register-dto';

export const AuthSwagger = {
  signup: () =>
    ApiDoc({
      extraModels: [RegisterDto],
      summary: 'Register a new user',
      consumes: ['application/json', 'multipart/form-data'],
      body: RegisterDto,
      res: {
        ok: undefined,
        conflict: { message: 'Phone number already registered' },
      },
    }),
  login: () =>
    ApiDoc({
      extraModels: [LoginDto],
      summary: 'Login with phone and password',
      body: LoginDto,
      res: {
        ok: undefined,
        unauthorized: { message: 'Invalid phone or password' },
      },
    }),
  logout: () =>
    ApiDoc({
      summary: 'Logout — invalidates current token',
      auth: true,
    }),
  checkReferralCode: () =>
    ApiDoc({
      summary: 'Check if a referral code is valid',
    }),
  changePassword: () =>
    ApiDoc({
      summary: 'Change password for a user',
      auth: true,
      params: [{ name: 'id', description: 'User ID' }],
    }),
  resetPassword: () =>
    ApiDoc({
      summary: 'Reset password by phone (ADMIN/CASHIER only)',
      auth: true,
    }),
};
