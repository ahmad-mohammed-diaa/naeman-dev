import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { BranchQueryService } from './branch-query.service';
import { Language } from 'generated/prisma/enums';
@Injectable()
export class BranchManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly branchQuery: BranchQueryService,
  ) {}

  create(dto: CreateBranchDto, lang: Language) {
    return this.prisma.branch.create({ data: dto });
  }

  async update(id: string, dto: UpdateBranchDto, lang: Language) {
    await this.branchQuery.findOne(id, lang);
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async remove(id: string, lang: Language) {
    await this.branchQuery.findOne(id, lang);
    await this.prisma.branch.delete({ where: { id } });
    return { message: 'Branch deleted' };
  }
}
