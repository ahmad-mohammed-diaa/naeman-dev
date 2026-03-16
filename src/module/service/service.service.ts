import { Injectable } from '@nestjs/common';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';
import { ServiceQueryService } from './services/service-query.service';
import { ServiceManageService } from './services/service-manage.service';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceQuery: ServiceQueryService,
    private readonly serviceManage: ServiceManageService,
  ) {}

  findAll(categoryId?: string) {
    return this.serviceQuery.findAll(categoryId);
  }

  findOne(id: string) {
    return this.serviceQuery.findOne(id);
  }

  create(dto: CreateServiceDto) {
    return this.serviceManage.create(dto);
  }

  update(id: string, dto: UpdateServiceDto) {
    return this.serviceManage.update(id, dto);
  }

  remove(id: string) {
    return this.serviceManage.remove(id);
  }
}
