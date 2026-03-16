import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { SlotAvailabilityService } from './services/slot-availability.service';

@Module({
  controllers: [SlotController],
  providers: [SlotService, SlotAvailabilityService],
  exports: [SlotService],
})
export class SlotModule {}
