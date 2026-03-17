import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { SlotResponseDto } from './dto/responses/slot-response.dto';

export const SlotSwagger = {
  getAvailable: () =>
    ApiDoc({
      summary: 'Get available slots',
      auth: true,
      queries: [
        { name: 'barberId', required: true, type: String },
        {
          name: 'date',
          required: true,
          type: String,
          description: 'ISO date e.g. 2025-01-15',
        },
        { name: 'serviceId', required: true, type: String },
      ],
      res: { ok: SlotResponseDto, notFound: { message: 'Barber not found' } },
    }),
};
