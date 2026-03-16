import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateCashierDto } from '../dto/update-cashier.dto';
import {
  CASHIER_SELECT,
  flattenUser,
  getCashier,
} from '@/common/helpers/user.helper';

export { CASHIER_SELECT };

@Injectable()
export class CashierCrudService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(branchId?: string) {
    const cashiers = await this.prisma.cashier.findMany({
      where: branchId ? { branchId } : undefined,
      select: CASHIER_SELECT,
    });
    return cashiers.map(flattenUser);
  }

  findOne(id: string) {
    return getCashier(this.prisma, id, ['slot', 'vacations']);
  }

  async update(id: string, dto: UpdateCashierDto) {
    await getCashier(this.prisma, id); // validates existence
    const { vacations, ...rest } = dto;
    const cashier = await this.prisma.cashier.update({
      where: { id },
      data: {
        ...rest,
        // ...(vacations !== undefined && { vacations }),
      },
      select: CASHIER_SELECT,
    });
    return flattenUser(cashier);
  }
}
