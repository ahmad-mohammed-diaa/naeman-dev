import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';
import { ServiceResponseDto } from './dto/responses/service-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const ServiceSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all services',
      queries: [{ name: 'categoryId' }],
      res: { ok: ServiceResponseDto, okIsArray: true },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get service by ID',
      params: [{ name: 'id' }],
      res: {
        ok: ServiceResponseDto,
        notFound: { message: 'Service not found' },
      },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create service',
      auth: true,
      body: CreateServiceDto,
      res: { ok: ServiceResponseDto },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update service',
      auth: true,
      params: [{ name: 'id' }],
      body: UpdateServiceDto,
      res: {
        ok: ServiceResponseDto,
        notFound: { message: 'Service not found' },
      },
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete service',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Service not found' },
      },
    }),
};
