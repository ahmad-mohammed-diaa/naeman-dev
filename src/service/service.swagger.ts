import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

export const ServiceSwagger = {
  findAllService: () =>
    ApiDoc({
      summary: 'Get all services',
    }),
  findServiceById: () =>
    ApiDoc({
      summary: 'Get a service by ID',
      params: [{ name: 'id', description: 'Service UUID' }],
    }),
  createService: () =>
    ApiDoc({
      summary: 'Create a service (ADMIN only)',
      auth: true,
      body: CreateServiceDto,
      consumes: ['application/json', 'multipart/form-data'],
    }),
  updateService: () =>
    ApiDoc({
      summary: 'Update a service (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Service UUID' }],
      body: UpdateServiceDto,
      consumes: ['application/json', 'multipart/form-data'],
    }),
  softDeleteService: () =>
    ApiDoc({
      summary: 'Toggle service availability (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Service UUID' }],
    }),
};
