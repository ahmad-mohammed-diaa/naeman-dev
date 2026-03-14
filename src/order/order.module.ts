import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PromoCodeService } from 'src/promo-code/promo-code.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PromoCodeService],
})
export class OrderModule {}
