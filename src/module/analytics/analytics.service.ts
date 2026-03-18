import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from 'generated/prisma/client';
import { startOfDay, endOfDay } from 'date-fns';
import { TranslateName } from '../../../lib/lib';
import { comparePassword } from '../../common/helpers/lib';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(roleName: string, fromDate?: Date, toDate?: Date) {
    const today = new Date();
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(today.getMonth() - 1);

    const summary = await this.analyticsSummary(
      fromDate ?? oneMonthBefore,
      toDate ?? today,
    );

    if (roleName === 'CASHIER') {
      return { ...summary };
    }

    const [TotalSalesPerBranch, ServiceUsageSummary] = await Promise.all([
      this.totalSalesPerBranch(fromDate, toDate),
      this.serviceUsageSummary(),
    ]);

    return { ...summary, TotalSalesPerBranch, ServiceUsageSummary };
  }

  async checkPassword(password: string) {
    const settings = await this.prisma.settings.findFirst({
      select: { password: true },
    });
    const valid = !!(password
      ? settings?.password &&
        (await comparePassword(password, settings.password))
      : false);
    return { valid };
  }

  private async analyticsSummary(fromDate?: Date, toDate?: Date) {
    const today = new Date();
    const startDate = fromDate ? startOfDay(fromDate) : startOfDay(today);
    const endDate = toDate ? endOfDay(toDate) : endOfDay(today);

    const [TotalOrderCount, aggregate] = await Promise.all([
      this.prisma.order.count({
        where: {
          status: OrderStatus.PAID,
          date: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          status: OrderStatus.PAID,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { total: true },
      }),
    ]);

    return { TotalOrderCount, TotalSales: aggregate._sum.total ?? 0 };
  }

  private async totalSalesPerBranch(fromDate?: Date, toDate?: Date) {
    const dateFilter =
      fromDate && toDate
        ? { date: { gte: startOfDay(fromDate), lte: endOfDay(toDate) } }
        : {};

    const branches = await this.prisma.branch.findMany({
      select: {
        id: true,
        translation: true,
        barber: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                id: true,
                BarberOrders: {
                  where: { status: OrderStatus.PAID, ...dateFilter },
                  select: {
                    total: true,
                    service: {
                      select: { translation: true, price: true, id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return branches.map((branch) => {
      const barbers = branch.barber.map((b) => {
        const servicesSummary: {
          id: string;
          name: string;
          price: number;
          count: number;
          totalRevenue: number;
        }[] = [];

        const totalSales = b.user.BarberOrders.reduce(
          (sum, order) => sum + (order.total ?? 0),
          0,
        );

        b.user.BarberOrders.forEach((order) => {
          order.service.forEach((srv) => {
            const name =
              TranslateName({ translation: srv.translation }, 'EN')?.name ??
              'Unknown';
            const existing = servicesSummary.find((s) => s.id === srv.id);
            if (existing) {
              existing.count += 1;
              existing.totalRevenue += srv.price;
            } else {
              servicesSummary.push({
                id: srv.id,
                name,
                price: srv.price,
                count: 1,
                totalRevenue: srv.price,
              });
            }
          });
        });

        return {
          id: b.id,
          barber: `${b.user.firstName} ${b.user.lastName}`,
          orderCount: b.user.BarberOrders.length,
          sales: totalSales,
          services: servicesSummary,
        };
      });

      return {
        id: branch.id,
        ...TranslateName({ translation: branch.translation }, 'EN'),
        barbers,
      };
    });
  }

  private async serviceUsageSummary() {
    const [branches, allServices] = await Promise.all([
      this.prisma.branch.findMany({ include: { translation: true } }),
      this.prisma.service.findMany({
        include: { translation: true, _count: { select: { order: true } } },
        orderBy: { order: { _count: 'desc' } },
      }),
    ]);

    return branches.map((branch) => ({
      branchId: branch.id,
      ...TranslateName({ translation: branch.translation }, 'EN'),
      services: allServices
        .filter((s) => s._count.order > 0)
        .map((s) => ({
          serviceId: s.id,
          ...TranslateName({ translation: s.translation }, 'EN'),
          usageCount: s._count.order,
        })),
    }));
  }
}
