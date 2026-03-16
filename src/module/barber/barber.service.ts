import { Injectable } from '@nestjs/common';
import { BarberCrudService } from './services/barber-crud.service';
import { BarberShiftService } from './services/barber-shift.service';
import { UpdateBarberDto } from './dto/create-barber.dto';
import { SetSlotDto } from './dto/set-slot.dto';
import { RateBarberDto } from './dto/rate-barber.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { DateRangeDto } from '../order/dto/date-range.dto';

@Injectable()
export class BarberService {
  constructor(
    private readonly crud: BarberCrudService,
    private readonly shift: BarberShiftService,
  ) {}

  findAll(branchId?: string, includeUnavailable?: boolean) {
    return this.crud.findAll(branchId, includeUnavailable);
  }
  findOne(id: string) {
    return this.crud.findOne(id);
  }
  update(id: string, dto: UpdateBarberDto) {
    return this.crud.update(id, dto);
  }
  setAvailability(id: string, dto: SetAvailabilityDto) {
    return this.crud.setAvailability(id, dto);
  }
  rate(barberId: string, clientId: string, dto: RateBarberDto) {
    return this.crud.rate(barberId, clientId, dto);
  }
  setSlot(barberId: string, dto: SetSlotDto) {
    return this.shift.setSlot(barberId, dto);
  }
  getBarberOrders(barberId: string, range: DateRangeDto) {
    return this.shift.getBarberOrders(barberId, range);
  }
}
