import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderReviewService } from './services/order-review.service';
import { OrderCreateService } from './services/order-create.service';
import { OrderQueryService } from './services/order-query.service';
import { OrderEditService } from './services/order-edit.service';
import { OrderCancelService } from './services/order-cancel.service';
import { OrderCleanupService } from './services/order-cleanup.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderReviewService,
    OrderCreateService,
    OrderQueryService,
    OrderEditService,
    OrderCancelService,
    OrderCleanupService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
