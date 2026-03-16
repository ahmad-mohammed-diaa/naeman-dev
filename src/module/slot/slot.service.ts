import { Injectable } from '@nestjs/common';
import { SlotAvailabilityService } from './services/slot-availability.service';

@Injectable()
export class SlotService {
  constructor(private readonly availability: SlotAvailabilityService) {}

  getAvailableSlots(barberId: string, date: string, serviceIds: string[]) {
    return this.availability.getAvailableSlots(barberId, date, serviceIds);
  }
}
