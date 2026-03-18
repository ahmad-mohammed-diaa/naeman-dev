import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { CreateComplainDto } from './dto/create-complain.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const ComplainSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Submit a complaint',
      auth: true,
      body: CreateComplainDto,
      res: { ok: MessageResponseDto },
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all complaints',
      auth: true,
      res: { ok: MessageResponseDto },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get complaint by ID',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: MessageResponseDto, notFound: { message: 'Complaint not found' } },
    }),
  resolve: () =>
    ApiDoc({
      summary: 'Mark complaint as resolved',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: MessageResponseDto, notFound: { message: 'Complaint not found' } },
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete a complaint',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: MessageResponseDto, notFound: { message: 'Complaint not found' } },
    }),
};
