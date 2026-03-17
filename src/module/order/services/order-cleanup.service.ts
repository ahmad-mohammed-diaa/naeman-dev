import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderCleanupService {
  private readonly logger = new Logger(OrderCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async purgeExpiredIdempotencyKeys() {
    const { count } = await this.prisma.idempotencyKey.deleteMany({
      where: { expiredAt: { lt: new Date() } },
    });
    if (!count) this.logger.debug('No expired idempotency keys to purge');
    if (count > 0)
      this.logger.log(`Purged ${count} expired idempotency key(s)`);
  }
}
