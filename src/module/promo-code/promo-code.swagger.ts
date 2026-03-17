import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { PromoCodeResponseDto } from './dto/responses/promo-response.dto';

export const PromoCodeSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all promo codes',
      auth: true,
      res: { ok: PromoCodeResponseDto, okIsArray: true },
    }),
  validate: () =>
    ApiDoc({
      summary: 'Validate a promo code',
      auth: true,
      params: [{ name: 'code' }],
      res: {
        ok: PromoCodeResponseDto,
        notFound: { message: 'Invalid or expired promo code' },
      },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create promo code',
      auth: true,
      body: CreatePromoCodeDto,
      res: { ok: PromoCodeResponseDto },
    }),
  deactivate: () =>
    ApiDoc({
      summary: 'Deactivate promo code',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: PromoCodeResponseDto,
        notFound: { message: 'Promo code not found' },
      },
    }),
};
