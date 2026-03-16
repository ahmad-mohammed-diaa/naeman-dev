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
import { BarberService } from './barber.service';
import { UpdateBarberDto } from './dto/create-barber.dto';
import { SetSlotDto } from './dto/set-slot.dto';
import { RateBarberDto } from './dto/rate-barber.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { BarberSwagger } from './barber.swagger';
import { DateRangeDto } from '../order/dto/date-range.dto';
import { FindBarbersQuery } from './dto/get-barbers-query.dot';
import { type User } from 'generated/prisma/client';

@Controller('v2/barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @BarberSwagger.findAll()
  @Get()
  findAll(@Query() query: FindBarbersQuery) {
    return this.barberService.findAll(query.branchId, query.includeUnavailable);
  }

  @BarberSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barberService.findOne(id);
  }

  @BarberSwagger.update()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:barbers')
  update(@Param('id') id: string, @Body() dto: UpdateBarberDto) {
    return this.barberService.update(id, dto);
  }

  @BarberSwagger.setAvailability()
  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:barbers')
  setAvailability(@Param('id') id: string, @Body() dto: SetAvailabilityDto) {
    return this.barberService.setAvailability(id, dto);
  }

  @BarberSwagger.setSlot()
  @Patch(':id/slot')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:barbers')
  setSlot(@Param('id') id: string, @Body() dto: SetSlotDto) {
    return this.barberService.setSlot(id, dto);
  }

  @BarberSwagger.rateBarber()
  @Post(':id/rate')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('rate:barbers')
  rate(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: RateBarberDto,
  ) {
    return this.barberService.rate(id, user.id, dto);
  }

  @BarberSwagger.getOrders()
  @Get(':id/orders')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('view:orders')
  getOrders(@Param('id') id: string, @Query() range: DateRangeDto) {
    return this.barberService.getBarberOrders(id, range);
  }
}
