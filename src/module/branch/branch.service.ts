import { Injectable } from '@nestjs/common';
import { BranchQueryService } from './services/branch-query.service';
import { BranchManageService } from './services/branch-manage.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Language } from 'generated/prisma/enums';

@Injectable()
export class BranchService {
  constructor(
    private readonly query: BranchQueryService,
    private readonly manage: BranchManageService,
  ) {}

  findAll(lang: Language) {
    return this.query.findAll(lang);
  }
  findOne(id: string, lang: Language) {
    return this.query.findOne(id, lang);
  }
  create(dto: CreateBranchDto, lang: Language) {
    return this.manage.create(dto, lang);
  }
  update(id: string, dto: UpdateBranchDto, lang: Language) {
    return this.manage.update(id, dto, lang);
  }
  remove(id: string, lang: Language) {
    return this.manage.remove(id, lang);
  }
}
