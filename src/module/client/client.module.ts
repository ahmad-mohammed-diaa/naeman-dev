import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientQueryService } from './services/client-query.service';
import { ClientManageService } from './services/client-manage.service';

@Module({
  controllers: [ClientController],
  providers: [ClientService, ClientQueryService, ClientManageService],
  exports: [ClientService, ClientQueryService],
})
export class ClientModule {}
