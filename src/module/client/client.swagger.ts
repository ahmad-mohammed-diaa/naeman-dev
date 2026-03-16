import { ApiDoc } from '@/common/decorators/api-doc.decorator';
import {
  ClientResponseDto,
  ClientListResponseDto,
} from './dto/responses/client-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const ClientSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all clients',
      auth: true,
      queries: [
        { name: 'page', type: Number },
        { name: 'limit', type: Number },
      ],
      res: { ok: ClientListResponseDto },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get client by ID',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: ClientResponseDto, notFound: { message: 'Client not found' } },
    }),
  ban: () =>
    ApiDoc({
      summary: 'Ban client',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Client not found' },
      },
    }),
  unban: () =>
    ApiDoc({
      summary: 'Unban client',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Client not found' },
      },
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete client',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Client not found' },
      },
    }),
};
