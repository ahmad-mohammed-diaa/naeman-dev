import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import {
  BranchResponseDto,
  BranchListResponseDto,
} from './dto/responses/branch-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const BranchSwagger = {
  findAll: () =>
    ApiDoc({ summary: 'Get all branches', res: { ok: BranchListResponseDto } }),
  findOne: () =>
    ApiDoc({
      summary: 'Get branch by ID',
      params: [{ name: 'id' }],
      res: { ok: BranchResponseDto, notFound: { message: 'Branch not found' } },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create branch',
      auth: true,
      body: CreateBranchDto,
      res: { ok: BranchResponseDto },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update branch',
      auth: true,
      params: [{ name: 'id' }],
      body: UpdateBranchDto,
      res: { ok: BranchResponseDto, notFound: { message: 'Branch not found' } },
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete branch',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Branch not found' },
      },
    }),
};
