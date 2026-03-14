import { Injectable } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *')
  async deleteExpiredTokens() {
    try {
      await this.prisma.token.deleteMany({
        where: {
          expiredAt: {
            lt: new Date(),
          },
        },
      });
    } catch (error) {
      console.error('Error deleting expired tokens:', error);
    }
  }
}
