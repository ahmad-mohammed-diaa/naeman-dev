import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

export const AdminSwagger = {
  create: () =>
    ApiDoc({
      summary: 'Create a new admin (ADMIN only)',
      auth: true,
      body: CreateAdminDto,
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all admins (ADMIN only)',
      auth: true,
    }),
  getAnalytics: () =>
    ApiDoc({
      summary: 'Get analytics / barber orders with counts (ADMIN, CASHIER)',
      auth: true,
      queries: [
        { name: 'fromDate', required: false, description: 'Start date (ISO string)' },
        { name: 'toDate', required: false, description: 'End date (ISO string)' },
      ],
    }),
  update: () =>
    ApiDoc({
      summary: 'Update admin settings (ADMIN only)',
      auth: true,
      body: UpdateAdminDto,
    }),
  checkPassword: () =>
    ApiDoc({
      summary: 'Verify admin password (ADMIN, CASHIER)',
      auth: true,
    }),
};
