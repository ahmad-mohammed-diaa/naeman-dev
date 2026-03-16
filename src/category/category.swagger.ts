import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export const CategorySwagger = {
  findAllCategories: () =>
    ApiDoc({
      summary: 'Get all categories (optional type filter)',
      queries: [
        { name: 'type', required: false, description: 'Category type (SERVICE, PACKAGE, etc.)' },
      ],
    }),
  findCategoryById: () =>
    ApiDoc({
      summary: 'Get a category by ID',
      params: [{ name: 'id', description: 'Category UUID' }],
    }),
  createCategory: () =>
    ApiDoc({
      summary: 'Create a category (ADMIN only)',
      auth: true,
      body: CreateCategoryDto,
    }),
  updateCategory: () =>
    ApiDoc({
      summary: 'Update a category (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Category UUID' }],
      body: UpdateCategoryDto,
    }),
  deleteCategory: () =>
    ApiDoc({
      summary: 'Delete a category (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Category UUID' }],
    }),
};
