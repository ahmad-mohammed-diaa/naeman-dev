import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Language } from 'generated/prisma/enums';
@Injectable()
export class BranchQueryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(lang: Language) {
    return this.prisma.branch.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, lang: Language) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }
}
