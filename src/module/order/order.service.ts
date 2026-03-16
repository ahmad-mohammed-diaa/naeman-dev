import { Injectable } from '@nestjs/common';
import { OrderReviewService } from './services/order-review.service';
import { OrderCreateService } from './services/order-create.service';
import { OrderQueryService } from './services/order-query.service';
import { OrderEditService } from './services/order-edit.service';
import { OrderCancelService } from './services/order-cancel.service';
import { ReviewOrderDto } from './dto/review-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { BarberUpdateOrderDto } from './dto/update-order.dto';
import { PaginationParams } from '@/common/helpers/pagination.helper';
import { DateRangeDto } from './dto/date-range.dto';
import { User } from 'generated/prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly reviewSvc: OrderReviewService,
    private readonly createSvc: OrderCreateService,
    private readonly querySvc: OrderQueryService,
    private readonly editSvc: OrderEditService,
    private readonly cancelSvc: OrderCancelService,
  ) {}

  review(userId: string, dto: ReviewOrderDto) {
    return this.reviewSvc.review(userId, dto);
  }
  create(dto: CreateOrderDto) {
    return this.createSvc.create(dto);
  }
  findAll(params: PaginationParams, range: DateRangeDto) {
    return this.querySvc.findAll(params, range);
  }
  findOne(id: string) {
    return this.querySvc.findOne(id);
  }
  findUserOrders(userId: string) {
    return this.querySvc.findUserOrders(userId);
  }
  barberUpdate(orderId: string, barberId: string, dto: BarberUpdateOrderDto) {
    return this.editSvc.barberUpdate(orderId, barberId, dto);
  }
  cancel(orderId: string, currentUser: User) {
    return this.cancelSvc.cancel(orderId, currentUser);
  }
  markInProgress(orderId: string) {
    return this.cancelSvc.markInProgress(orderId);
  }
  markComplete(orderId: string) {
    return this.cancelSvc.markComplete(orderId);
  }
  markPaid(orderId: string) {
    return this.cancelSvc.markPaid(orderId);
  }
}
