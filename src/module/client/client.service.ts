import { Injectable } from '@nestjs/common';
import { ClientQueryService } from './services/client-query.service';
import { ClientManageService } from './services/client-manage.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly query: ClientQueryService,
    private readonly manage: ClientManageService,
  ) {}

  findAll(page?: number, limit?: number) { return this.query.findAll({ page, limit }); }
  findOne(id: string) { return this.query.findOne(id); }
  ban(id: string) { return this.manage.ban(id); }
  unban(id: string) { return this.manage.unban(id); }
  remove(id: string) { return this.manage.remove(id); }
}
