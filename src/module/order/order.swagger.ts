import { ApiDoc } from '@/common/decorators/api-doc.decorator';
import { ReviewOrderDto } from './dto/review-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { BarberUpdateOrderDto, CancelOrderDto } from './dto/update-order.dto';
import {
  OrderResponseDto,
  ReviewTokenResponseDto,
} from './dto/responses/order-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const OrderSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all orders (admin, paginated, optional date range)',
      auth: true,
      queries: [
        { name: 'page', required: false },
        { name: 'limit', required: false },
        { name: 'from', required: false },
        { name: 'to', required: false },
      ],
      res: { ok: OrderResponseDto, okIsArray: true },
    }),
  review: () =>
    ApiDoc({
      summary: 'Review order (step 1)',
      auth: true,
      body: ReviewOrderDto,
      res: {
        ok: ReviewTokenResponseDto,
        notFound: { message: 'Barber / service not found' },
        badRequest: { message: 'Invalid booking data' },
      },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create order (step 2)',
      auth: true,
      body: CreateOrderDto,
      res: {
        ok: OrderResponseDto,
        conflict: { message: 'Duplicate order detected' },
        badRequest: { message: 'Invalid or expired review token' },
      },
    }),
  myOrders: () =>
    ApiDoc({
      summary: 'Get my orders',
      auth: true,
      res: { ok: OrderResponseDto, okIsArray: true },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get order by ID',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: OrderResponseDto, notFound: { message: 'Order not found' } },
    }),
  barberUpdate: () =>
    ApiDoc({
      summary: 'Barber edits order services',
      auth: true,
      params: [{ name: 'id' }],
      body: BarberUpdateOrderDto,
      res: {
        ok: OrderResponseDto,
        notFound: { message: 'Order not found' },
        forbidden: { message: 'Package orders cannot be edited' },
      },
    }),
  cancel: () =>
    ApiDoc({
      summary: 'Cancel order',
      auth: true,
      params: [{ name: 'id' }],
      body: CancelOrderDto,
      res: { ok: MessageResponseDto, notFound: { message: 'Order not found' } },
    }),
  markInProgress: () =>
    ApiDoc({
      summary: 'Mark order as IN_PROGRESS',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: MessageResponseDto, notFound: { message: 'Order not found' }, badRequest: { message: 'Only PENDING orders can be marked in-progress' } },
    }),
  markComplete: () =>
    ApiDoc({
      summary: 'Mark order as COMPLETED (earns points)',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: MessageResponseDto, notFound: { message: 'Order not found' }, badRequest: { message: 'Only IN_PROGRESS orders can be completed' } },
    }),
  markPaid: () =>
    ApiDoc({
      summary: 'Mark order as PAID',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: MessageResponseDto, notFound: { message: 'Order not found' }, badRequest: { message: 'Only COMPLETED orders can be marked as paid' } },
    }),
};
