import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PointsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async getClientPoints(clientId: string) {
    return this.prisma.client.findUnique({
      where: { id: clientId },
      select: { points: true },
    });
  }

  async getTransactions(clientId: string) {
    return this.prisma.pointTransaction.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
