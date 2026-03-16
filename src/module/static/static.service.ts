import { Injectable } from '@nestjs/common';
import { StaticQueryService } from './services/static-query.service';
import { StaticUpdateService } from './services/static-update.service';
import { UpdateStaticDto } from './dto/update-static.dto';

@Injectable()
export class StaticService {
  constructor(
    private readonly query: StaticQueryService,
    private readonly updateSvc: StaticUpdateService,
  ) {}

  get() { return this.query.get(); }
  update(dto: UpdateStaticDto) { return this.updateSvc.update(dto); }
}
