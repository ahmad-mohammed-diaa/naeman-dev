import { Injectable } from '@nestjs/common';
import { CashierCrudService } from './services/cashier-crud.service';
import { CashierShiftService } from './services/cashier-shift.service';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { SetSlotDto } from '../barber/dto/set-slot.dto';
import { DateRangeDto } from '../order/dto/date-range.dto';

@Injectable()
export class CashierService {
  constructor(
    private readonly crud: CashierCrudService,
    private readonly shift: CashierShiftService,
  ) {}

  findAll(branchId?: string) { return this.crud.findAll(branchId); }
  findOne(id: string) { return this.crud.findOne(id); }
  update(id: string, dto: UpdateCashierDto) { return this.crud.update(id, dto); }
  setSlot(cashierId: string, dto: SetSlotDto) { return this.shift.setSlot(cashierId, dto); }
  getCashierOrders(cashierId: string, range: DateRangeDto) { return this.shift.getCashierOrders(cashierId, range); }
}
