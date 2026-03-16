import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export const ProductSwagger = {
  createProduct: () =>
    ApiDoc({
      summary: 'Create a new product',
      body: CreateProductDto,
      consumes: 'multipart/form-data',
    }),
  getAllProducts: () =>
    ApiDoc({
      summary: 'Get all products',
    }),
  getProductById: () =>
    ApiDoc({
      summary: 'Get a product by ID',
      params: [{ name: 'id', description: 'Product ID' }],
    }),
  updateProduct: () =>
    ApiDoc({
      summary: 'Update a product',
      params: [{ name: 'id', description: 'Product ID' }],
      body: UpdateProductDto,
    }),
  deleteProduct: () =>
    ApiDoc({
      summary: 'Delete a product',
      params: [{ name: 'id', description: 'Product ID' }],
    }),
};
