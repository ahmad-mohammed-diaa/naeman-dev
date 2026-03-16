import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { ServiceQueryService } from './services/service-query.service';
import { ServiceManageService } from './services/service-manage.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, ServiceQueryService, ServiceManageService],
  exports: [ServiceService],
})
export class ServiceModule {}
