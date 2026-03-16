import { ApiDoc } from '@/common/decorators/api-doc.decorator';
import { UpdateBarberDto } from './dto/create-barber.dto';
import { SetSlotDto } from './dto/set-slot.dto';
import { RateBarberDto } from './dto/rate-barber.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { BarberResponseDto } from './dto/responses/barber-response.dto';
import { OrderResponseDto } from '../order/dto/responses/order-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const BarberSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all available barbers',
      queries: [
        { name: 'branchId', required: false },
        { name: 'isAvailable', required: false },
      ],
      res: { ok: BarberResponseDto, okIsArray: true },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get barber by ID',
      params: [{ name: 'id' }],
      res: { ok: BarberResponseDto, notFound: { message: 'Barber not found' } },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update barber',
      auth: true,
      params: [{ name: 'id' }],
      body: UpdateBarberDto,
      res: { ok: BarberResponseDto, notFound: { message: 'Barber not found' } },
    }),
  setAvailability: () =>
    ApiDoc({
      summary: 'Toggle barber availability (admin only)',
      auth: true,
      params: [{ name: 'id' }],
      body: SetAvailabilityDto,
      res: { ok: BarberResponseDto, notFound: { message: 'Barber not found' } },
    }),
  setSlot: () =>
    ApiDoc({
      summary: 'Set barber shift slot',
      auth: true,
      params: [{ name: 'id' }],
      body: SetSlotDto,
      res: { ok: BarberResponseDto, notFound: { message: 'Barber not found' } },
    }),
  rateBarber: () =>
    ApiDoc({
      summary: 'Rate a barber 1–5 (client only)',
      auth: true,
      params: [{ name: 'id' }],
      body: RateBarberDto,
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Barber not found' },
      },
    }),
  getOrders: () =>
    ApiDoc({
      summary: 'Get barber orders (today+ by default; past dates forbidden)',
      auth: true,
      params: [{ name: 'id' }],
      queries: [
        { name: 'from', required: false },
        { name: 'to', required: false },
      ],
      res: {
        ok: OrderResponseDto,
        okIsArray: true,
        notFound: { message: 'Barber not found' },
        badRequest: { message: 'Cannot query past orders' },
      },
    }),
};
