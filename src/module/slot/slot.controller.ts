import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SlotService } from './slot.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { SlotSwagger } from './slot.swagger';
import { AvailableSlotQuery } from './dto/available-slot-query.dto';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v2/slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @SlotSwagger.getAvailable()
  @Get()
  @Permissions('view:slots')
  getAvailable(@Query() query: AvailableSlotQuery) {
    const { barberId, date, serviceIds } = query;
    return this.slotService.getAvailableSlots(barberId, date, serviceIds);
  }
}
