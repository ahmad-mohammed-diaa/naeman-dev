import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import {
  PointsResponseDto,
  TransactionResponseDto,
} from './dto/responses/points-response.dto';

export const PointsSwagger = {
  myPoints: () =>
    ApiDoc({
      summary: 'Get my points balance',
      auth: true,
      res: { ok: PointsResponseDto },
    }),
  myTransactions: () =>
    ApiDoc({
      summary: 'Get my points transactions',
      auth: true,
      res: { ok: TransactionResponseDto, okIsArray: true },
    }),
};
