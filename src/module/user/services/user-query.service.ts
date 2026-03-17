import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppNotFoundException } from '../../../common/exceptions/app.exception';
import {
  buildPagination,
  PaginationParams,
} from '../../../common/helpers/pagination.helper';

// Flatten nested barber/cashier/client sub-objects to root level
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenUserRecord(user: any) {
  const { roleRef: role, barber, cashier, client, ...base } = user;
  const roleFields = barber ?? cashier ?? client ?? {};
  return { ...base, role: role?.name ?? null, ...roleFields };
}

@Injectable()
export class UserQueryService {
  constructor(private readonly prisma: PrismaService) {}
  USER_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    avatar: true,
    createdAt: true,
    deleted: true,
    roleRef: { select: { name: true } },
    barber: {
      select: { branchId: true, rate: true, isAvailable: true, type: true },
    },
    cashier: { select: { branchId: true } },
    client: { select: { points: true, ban: true, canceledOrders: true } },
  };
  async findAll(params: PaginationParams = {}) {
    const { pagination, buildResult } = buildPagination(params);
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deleted: false },
        select: this.USER_SELECT,
        ...pagination,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { deleted: false } }),
    ]);
    return buildResult(data.map(flattenUserRecord), total);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deleted: false },
      select: this.USER_SELECT,
    });
    if (!user) throw new AppNotFoundException('NOT_FOUND_USER');
    return flattenUserRecord(user);
  }
}
