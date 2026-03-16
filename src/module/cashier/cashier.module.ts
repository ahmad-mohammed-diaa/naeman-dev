import { Module } from '@nestjs/common';
import { CashierController } from './cashier.controller';
import { CashierService } from './cashier.service';
import { CashierCrudService } from './services/cashier-crud.service';
import { CashierShiftService } from './services/cashier-shift.service';

@Module({
  controllers: [CashierController],
  providers: [CashierService, CashierCrudService, CashierShiftService],
  exports: [CashierService],
})
export class CashierModule {}
