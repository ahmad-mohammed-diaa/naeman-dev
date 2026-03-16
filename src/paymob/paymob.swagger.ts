import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreatePaymobDto } from './dto/create-paymob.dto';

export const PaymobSwagger = {
  getPaymentKey: () =>
    ApiDoc({
      summary: 'Initiate Paymob payment and redirect to checkout',
      auth: true,
      body: CreatePaymobDto,
    }),
  verifyPaymobQuery: () =>
    ApiDoc({
      summary: 'Paymob callback — verify payment result',
    }),
  test: () =>
    ApiDoc({
      summary: 'Transaction status page',
    }),
};
