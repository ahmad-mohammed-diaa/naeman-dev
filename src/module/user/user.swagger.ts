import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UserResponseDto,
  UserListResponseDto,
} from './dto/responses/user-response.dto';
import { MessageResponseDto } from '../auth/dto/responses/auth-response.dto';

export const UserSwagger = {
  findAll: () =>
    ApiDoc({
      summary: 'Get all users',
      auth: true,
      queries: [
        { name: 'page', type: Number },
        { name: 'limit', type: Number },
      ],
      res: { ok: UserListResponseDto },
    }),
  me: () =>
    ApiDoc({
      summary: 'Get current user profile',
      auth: true,
      res: { ok: UserResponseDto, notFound: { message: 'User not found' } },
    }),
  findOne: () =>
    ApiDoc({
      summary: 'Get user by ID',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: UserResponseDto, notFound: { message: 'User not found' } },
    }),
  create: () =>
    ApiDoc({
      summary: 'Create user',
      auth: true,
      body: CreateUserDto,
      res: {
        ok: UserResponseDto,
        conflict: { message: 'Phone number already registered' },
      },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update user',
      auth: true,
      params: [{ name: 'id' }],
      consumes: ['application/json', 'multipart/form-data'],
      bodySchema: {
        type: 'object',
        properties: {
          avatar: {
            type: 'string',
            format: 'binary',
            description: 'Avatar image file (optional)',
          },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          password: { type: 'string', minLength: 6 },
          fcmToken: { type: 'string' },
        },
      },
      res: { ok: UserResponseDto, notFound: { message: 'User not found' } },
    }),
  remove: () =>
    ApiDoc({
      summary: 'Delete user',
      auth: true,
      params: [{ name: 'id' }],
      res: { ok: MessageResponseDto, notFound: { message: 'User not found' } },
    }),
};
