import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ReviewOrderDto } from './dto/review-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { BarberUpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrderSwagger } from './order.swagger';
import { type User } from 'generated/prisma/client';
import { OrderQueryDto } from './dto/order-query.dto';

// @UseGuards(JwtAuthGuard)
@Controller('v2/orders')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @OrderSwagger.findAll()
  @Get()
  @Permissions('view:orders')
  findAll(@Query() query: OrderQueryDto) {
    return this.orderService.findAll(
      { page: query.page, limit: query.limit },
      { from: query.from, to: query.to },
    );
  }

  @OrderSwagger.review()
  @Post('review')
  @Permissions('create:orders')
  review(@CurrentUser() user: User, @Body() dto: ReviewOrderDto) {
    return this.orderService.review(user.id, dto);
  }

  @OrderSwagger.create()
  @Post()
  @Permissions('create:orders')
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @OrderSwagger.myOrders()
  @Get('my')
  @Permissions('view:orders')
  myOrders(@CurrentUser() user: User) {
    return this.orderService.findUserOrders(user.id);
  }

  @OrderSwagger.findOne()
  @Get(':id')
  // @Permissions('view:orders')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @OrderSwagger.barberUpdate()
  @Patch(':id/barber-edit')
  @Permissions('edit:orders')
  barberUpdate(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: BarberUpdateOrderDto,
  ) {
    return this.orderService.barberUpdate(id, user.id, dto);
  }

  @OrderSwagger.cancel()
  @Patch(':id/cancel')
  @Permissions('mark:cancelled:orders')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.orderService.cancel(id, user);
  }

  @OrderSwagger.markInProgress()
  @Patch(':id/in-progress')
  @Permissions('mark:in-progress:orders')
  markInProgress(@Param('id') id: string) {
    return this.orderService.markInProgress(id);
  }

  @OrderSwagger.markComplete()
  @Patch(':id/complete')
  @Permissions('mark:completed:orders')
  markComplete(@Param('id') id: string) {
    return this.orderService.markComplete(id);
  }

  @OrderSwagger.markPaid()
  @Patch(':id/pay')
  @Permissions('mark:paid:orders')
  markPaid(@Param('id') id: string) {
    return this.orderService.markPaid(id);
  }
}
