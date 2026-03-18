import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { CheckPasswordDto } from './dto/check-password.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const AnalyticsSwagger = {
  get: () =>
    ApiDoc({
      summary: 'Get analytics data (orders, sales, services)',
      auth: true,
      queries: [
        { name: 'fromDate', type: String, required: false },
        { name: 'toDate', type: String, required: false },
      ],
      res: { ok: MessageResponseDto },
    }),
  checkPassword: () =>
    ApiDoc({
      summary: 'Verify admin/cashier password',
      auth: true,
      body: CheckPasswordDto,
      res: { ok: MessageResponseDto },
    }),
};
