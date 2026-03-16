import { Injectable } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { PromoQueryService } from './services/promo-query.service';
import { PromoManageService } from './services/promo-manage.service';

@Injectable()
export class PromoCodeService {
  constructor(
    private readonly query: PromoQueryService,
    private readonly manage: PromoManageService,
  ) {}

  findAll() { return this.query.findAll(); }
  findOne(id: string) { return this.query.findOne(id); }
  validate(code: string) { return this.query.validate(code); }
  create(dto: CreatePromoCodeDto) { return this.manage.create(dto); }
  deactivate(id: string) { return this.manage.deactivate(id); }
}
