import { ApiDoc } from '@/common/decorators/api-doc.decorator';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/responses/category-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const CategorySwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all categories',
      res: { ok: CategoryResponseDto, okIsArray: true },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get category by ID',
      params: [{ name: 'id' }],
      res: {
        ok: CategoryResponseDto,
        notFound: { message: 'Category not found' },
      },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create category',
      auth: true,
      body: CreateCategoryDto,
      res: { ok: CategoryResponseDto },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update category',
      auth: true,
      params: [{ name: 'id' }],
      body: UpdateCategoryDto,
      res: {
        ok: CategoryResponseDto,
        notFound: { message: 'Category not found' },
      },
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete category',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Category not found' },
      },
    }),
};
