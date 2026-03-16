import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';

export const PromoCodeSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Create a promo code',
      auth: true,
      body: CreatePromoCodeDto,
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all promo codes',
      auth: true,
    }),
  validatePromoCode: () =>
    ApiDoc({
      summary: 'Validate a promo code',
      auth: true,
    }),
  deletePromoCode: () =>
    ApiDoc({
      summary: 'Delete a promo code',
      auth: true,
      params: [{ name: 'id', description: 'Promo code ID' }],
    }),
};
