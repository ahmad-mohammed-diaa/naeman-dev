import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { RolesGuard } from 'guard/role.guard';
import { AuthGuard } from 'guard/auth.guard';
import { PromoCodeSwagger } from './promo-code.swagger';

@ApiTags('Promo Code')
@UseGuards(AuthGuard(), RolesGuard)
@Controller('v1/promo-code')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @PromoCodeSwagger.create()
  @Post()
  create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return this.promoCodeService.createPromoCode(createPromoCodeDto);
  }

  @PromoCodeSwagger.findAll()
  @Get()
  findAll() {
    return this.promoCodeService.getAllPromoCode();
  }

  @PromoCodeSwagger.validatePromoCode()
  @Post('/valid-promo-code')
  async validatePromoCode(@Body('code') code: string) {
    return this.promoCodeService.validatePromoCode(code);
  }

  @PromoCodeSwagger.deletePromoCode()
  @Delete('/:id')
  async deletePromoCode(@Param('id') id: string) {
    return this.promoCodeService.deletePromoCode(id);
  }
}
