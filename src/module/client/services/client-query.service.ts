import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CLIENT_SELECT,
  flattenUser,
  getClient,
} from '@/common/helpers/user.helper';
import {
  buildPagination,
  PaginationParams,
} from '@/common/helpers/pagination.helper';

@Injectable()
export class ClientQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: PaginationParams = {}) {
    const { pagination, buildResult } = buildPagination(params);
    const [raw, total] = await Promise.all([
      this.prisma.client.findMany({ ...pagination, select: CLIENT_SELECT }),
      this.prisma.client.count(),
    ]);
    return buildResult(raw.map(flattenUser), total);
  }

  findOne(id: string) {
    return getClient(this.prisma, id, ['clientPackages', 'complain']);
  }
}
