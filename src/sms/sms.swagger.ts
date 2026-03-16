import { ApiDoc } from 'src/common/decorators/api-doc.decorator';

export const SmsSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Send a verification SMS code',
      consumes: 'multipart/form-data',
    }),
  resetPassword: () =>
    ApiDoc({
      summary: 'Send a password-reset SMS code',
    }),
  verifyCode: () =>
    ApiDoc({
      summary: 'Verify a registration SMS code and complete signup',
      consumes: 'multipart/form-data',
    }),
  verifyResetCode: () =>
    ApiDoc({
      summary: 'Verify reset code and set new password',
    }),
  resendRegistrationCode: () =>
    ApiDoc({
      summary: 'Resend registration OTP',
    }),
  resendResetPasswordCode: () =>
    ApiDoc({
      summary: 'Resend password-reset OTP',
    }),
};
