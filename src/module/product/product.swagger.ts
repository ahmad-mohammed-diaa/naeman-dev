import { ApiDoc } from '@/common/decorators/api-doc.decorator';
import { ProductResponseDto } from './dto/responses/product-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const ProductSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all products',
      res: { ok: ProductResponseDto, okIsArray: true },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get product by ID',
      params: [{ name: 'id' }],
      res: {
        ok: ProductResponseDto,
        notFound: { message: 'Product not found' },
      },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create product',
      auth: true,
      consumes: ['application/json', 'multipart/form-data'],
      bodySchema: {
        type: 'object',
        required: ['image', 'price', 'translations'],
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: 'Product image file',
          },
          price: { type: 'integer', minimum: 1 },
          translations: {
            type: 'string',
            description: 'JSON string: [{name, language}]',
          },
        },
      },
      res: { ok: ProductResponseDto },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update product',
      auth: true,
      params: [{ name: 'id' }],
      consumes: ['application/json', 'multipart/form-data'],
      bodySchema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: 'Product image file (optional)',
          },
          price: { type: 'integer', minimum: 1 },
          translations: {
            type: 'string',
            description: 'JSON string: [{name, language}]',
          },
        },
      },
      res: {
        ok: ProductResponseDto,
        notFound: { message: 'Product not found' },
      },
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete product',
      auth: true,
      params: [{ name: 'id' }],
      res: {
        ok: MessageResponseDto,
        notFound: { message: 'Product not found' },
      },
    }),
};
