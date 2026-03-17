import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreatePackageDto } from './dto/create-package.dto';

export const PackageSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Create a new package',
      auth: true,
      body: CreatePackageDto,
      consumes: ['application/json', 'multipart/form-data'],
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all packages',
      auth: true,
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get a package by ID',
      auth: true,
      params: [{ name: 'id', description: 'Package ID' }],
    }),
  update: () =>
    ApiDoc({
      summary: 'Update a package (ADMIN only)',
      auth: true,
      params: [{ name: 'id', description: 'Package ID' }],
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete all packages',
      auth: true,
    }),
};
