import { ApiDoc } from 'src/common/decorators/api-doc.decorator';

export const MockSwagger = {
  get: () =>
    ApiDoc({
      summary: 'Seed mock client data (dev only)',
    }),
};
