import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { PromoCodeSwagger } from './promo-code.swagger';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v1/promo-codes')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @PromoCodeSwagger.findAll()
  @Get()
  @Permissions('view:promo-codes')
  findAll() {
    return this.promoCodeService.findAll();
  }

  @PromoCodeSwagger.validate()
  @Get('validate/:code')
  @Permissions('view:promo-codes')
  validate(@Param('code') code: string) {
    return this.promoCodeService.validate(code);
  }

  @PromoCodeSwagger.create()
  @Post()
  @Permissions('create:promo-codes')
  create(@Body() dto: CreatePromoCodeDto) {
    return this.promoCodeService.create(dto);
  }

  @PromoCodeSwagger.deactivate()
  @Patch(':id/deactivate')
  @Permissions('create:promo-codes')
  deactivate(@Param('id') id: string) {
    return this.promoCodeService.deactivate(id);
  }
}
