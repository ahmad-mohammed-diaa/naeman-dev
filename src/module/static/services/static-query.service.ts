import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class StaticQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    let page = await this.prisma.static.findFirst({ include: { about: true, questions: true } });
    if (!page) {
      page = await this.prisma.static.create({ data: {}, include: { about: true, questions: true } });
    }
    return page;
  }
}
