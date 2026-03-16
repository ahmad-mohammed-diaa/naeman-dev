import { Module } from '@nestjs/common';
import { BarberController } from './barber.controller';
import { BarberService } from './barber.service';
import { BarberCrudService } from './services/barber-crud.service';
import { BarberShiftService } from './services/barber-shift.service';

@Module({
  controllers: [BarberController],
  providers: [BarberService, BarberCrudService, BarberShiftService],
  exports: [BarberService],
})
export class BarberModule {}
