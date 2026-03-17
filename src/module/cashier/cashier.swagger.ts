import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { SetSlotDto } from '../barber/dto/set-slot.dto';
import { CashierResponseDto } from './dto/responses/cashier-response.dto';
import { OrderResponseDto } from '../order/dto/responses/order-response.dto';

export const CashierSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all cashiers',
      queries: [{ name: 'branchId' }],
      res: { ok: CashierResponseDto, okIsArray: true },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get cashier by ID',
      params: [{ name: 'id' }],
      res: {
        ok: CashierResponseDto,
        notFound: { message: 'Cashier not found' },
      },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update cashier',
      auth: true,
      params: [{ name: 'id' }],
      body: UpdateCashierDto,
      res: {
        ok: CashierResponseDto,
        notFound: { message: 'Cashier not found' },
      },
    }),
  setSlot: () =>
    ApiDoc({
      summary: 'Set cashier shift slot',
      auth: true,
      params: [{ name: 'id' }],
      body: SetSlotDto,
      res: {
        ok: CashierResponseDto,
        notFound: { message: 'Cashier not found' },
      },
    }),
  getOrders: () =>
    ApiDoc({
      summary: 'Get cashier orders with optional date range',
      auth: true,
      params: [{ name: 'id' }],
      queries: [
        { name: 'from', required: false },
        { name: 'to', required: false },
      ],
      res: {
        ok: OrderResponseDto,
        okIsArray: true,
        notFound: { message: 'Cashier not found' },
      },
    }),
};
