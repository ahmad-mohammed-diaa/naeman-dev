import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

export const PointsSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Create a points package',
      auth: true,
      body: CreatePointDto,
      consumes: ['application/json', 'multipart/form-data'],
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all points packages',
      auth: true,
    }),
  purchasePoint: () =>
    ApiDoc({
      summary: 'Purchase a points package',
      auth: true,
      params: [{ name: 'pointId', description: 'Points package ID' }],
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get a points package by ID',
      auth: true,
      params: [{ name: 'id', description: 'Points package ID' }],
    }),
  update: () =>
    ApiDoc({
      summary: 'Update a points package',
      auth: true,
      params: [{ name: 'id', description: 'Points package ID' }],
      body: UpdatePointDto,
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete a points package',
      auth: true,
      params: [{ name: 'id', description: 'Points package ID' }],
    }),
};
