import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CashierService } from './cashier.service';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { SetSlotDto } from '../barber/dto/set-slot.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CashierSwagger } from './cashier.swagger';
import { DateRangeDto } from '../order/dto/date-range.dto';

@Controller('v2/cashiers')
export class CashierController {
  constructor(private readonly cashierService: CashierService) {}

  @CashierSwagger.findAll()
  @Get()
  findAll(@Query('branchId') branchId?: string) {
    return this.cashierService.findAll(branchId);
  }

  @CashierSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashierService.findOne(id);
  }

  @CashierSwagger.getOrders()
  @Get(':id/orders')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('view:orders')
  getOrders(@Param('id') id: string, @Query() range: DateRangeDto) {
    return this.cashierService.getCashierOrders(id, range);
  }

  @CashierSwagger.update()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:cashiers')
  update(@Param('id') id: string, @Body() dto: UpdateCashierDto) {
    return this.cashierService.update(id, dto);
  }

  @CashierSwagger.setSlot()
  @Patch(':id/slot')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:cashiers')
  setSlot(@Param('id') id: string, @Body() dto: SetSlotDto) {
    return this.cashierService.setSlot(id, dto);
  }
}
