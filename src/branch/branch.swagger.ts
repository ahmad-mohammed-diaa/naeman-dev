import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

export const BranchSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Create a new branch (ADMIN only)',
      auth: true,
      body: CreateBranchDto,
      consumes: ['application/json', 'multipart/form-data'],
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all branches',
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get a branch by ID with services grouped by category',
      params: [{ name: 'id', description: 'Branch UUID' }],
      queries: [
        { name: 'Date', required: false, description: 'Filter date' },
        { name: 'type', required: false, description: 'Category type' },
      ],
    }),
  update: () =>
    ApiDoc({
      summary: 'Update a branch (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Branch UUID' }],
      body: UpdateBranchDto,
      consumes: ['application/json', 'multipart/form-data'],
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete a branch (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Branch UUID' }],
    }),
};
