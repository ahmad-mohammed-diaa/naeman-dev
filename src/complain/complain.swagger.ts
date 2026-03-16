import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateComplainDto } from './dto/create-complain.dto';

export const ComplainSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Submit a complaint (USER, ADMIN)',
      auth: true,
      body: CreateComplainDto,
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all complaints (ADMIN only)',
      auth: true,
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get a complaint by ID (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Complaint ID' }],
    }),
  update: () =>
    ApiDoc({
      summary: 'Mark a complaint as resolved (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Complaint ID' }],
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete a complaint (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Complaint ID' }],
    }),
};
