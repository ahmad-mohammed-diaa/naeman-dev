import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { UserUpdateDto } from './dto/user-update-dto';

export const UserSwagger = {
  unbanUser: () =>
    ApiDoc({
      summary: 'Unban a user by phone number',
      auth: true,
    }),
  findAll: () =>
    ApiDoc({
      summary: 'Get all users (paginated, optional role filter)',
      auth: true,
      queries: [
        { name: 'role', required: false, description: 'Filter by role' },
        { name: 'page', required: false, type: Number },
        { name: 'pageSize', required: false, type: Number },
      ],
    }),
  findAllClients: () =>
    ApiDoc({
      summary: 'Get all client users (paginated, optional phone search)',
      auth: true,
      queries: [
        { name: 'page', required: false, type: Number },
        { name: 'pageSize', required: false, type: Number },
        { name: 'phone', required: false },
      ],
    }),
  update: () =>
    ApiDoc({
      summary: 'Update a user profile',
      auth: true,
      params: [{ name: 'id', description: 'User UUID' }],
      body: UserUpdateDto,
      consumes: ['application/json', 'multipart/form-data'],
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get a user by ID',
      auth: true,
      params: [{ name: 'id', description: 'User UUID' }],
    }),
  currentUser: () =>
    ApiDoc({
      summary: 'Get current authenticated user profile',
      auth: true,
    }),
  delete: () =>
    ApiDoc({
      summary: 'Delete a user account',
      auth: true,
    }),
  deleteEmployee: () =>
    ApiDoc({
      summary: 'Delete an employee account by ID',
      auth: true,
      params: [{ name: 'id', description: 'Employee UUID' }],
    }),
  rateBarber: () =>
    ApiDoc({
      summary: 'Rate a barber',
      auth: true,
    }),
};
