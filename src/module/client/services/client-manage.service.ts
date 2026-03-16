import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ClientQueryService } from './client-query.service';

@Injectable()
export class ClientManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly query: ClientQueryService,
  ) {}

  async ban(id: string) {
    await this.query.findOne(id);
    await this.prisma.client.update({ where: { id }, data: { ban: true } });
    return { message: 'Client banned' };
  }

  async unban(id: string) {
    await this.query.findOne(id);
    await this.prisma.client.update({ where: { id }, data: { ban: false } });
    return { message: 'Client unbanned' };
  }

  async remove(id: string) {
    await this.query.findOne(id);
    await this.prisma.user.update({ where: { id }, data: { deleted: true } });
    return { message: 'Client deleted' };
  }
}
