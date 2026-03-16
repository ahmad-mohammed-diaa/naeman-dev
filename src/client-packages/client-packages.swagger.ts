import { ApiDoc } from 'src/common/decorators/api-doc.decorator';

export const ClientPackagesSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Assign a package to a client by phone',
      auth: true,
      queries: [{ name: 'packageId', required: true, description: 'Package ID' }],
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all client packages',
      auth: true,
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get a client package by ID',
      auth: true,
      params: [{ name: 'id', description: 'Client package ID' }],
    }),
  update: () =>
    ApiDoc({
      summary: 'Update a client package',
      auth: true,
      params: [{ name: 'id', description: 'Client package ID' }],
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete a client package',
      auth: true,
      params: [{ name: 'id', description: 'Client package ID' }],
    }),
};
