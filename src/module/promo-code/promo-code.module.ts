import { Module } from '@nestjs/common';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';
import { PromoQueryService } from './services/promo-query.service';
import { PromoManageService } from './services/promo-manage.service';

@Module({
  controllers: [PromoCodeController],
  providers: [PromoCodeService, PromoQueryService, PromoManageService],
})
export class PromoCodeModule {}
