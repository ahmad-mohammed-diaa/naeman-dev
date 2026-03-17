import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserQueryService } from './user-query.service';
import {
  AppConflictException,
  AppNotFoundException,
} from '../../../common/exceptions/app.exception';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

@Injectable()
export class UserManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userQuery: UserQueryService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(dto: CreateUserDto) {
    const {
      firstName,
      lastName,
      phone,
      password,
      role: roleName,
      branchId,
    } = dto;
    const exists = await this.prisma.user.findUnique({ where: { phone } });
    if (exists) throw new AppConflictException('CONFLICT_USER');

    const UniqueRole = await this.prisma.roles.findUnique({
      where: { name: roleName },
    });
    const role = UniqueRole?.name;
    if (!role) throw new AppNotFoundException('NOT_FOUND_ROLE');

    if ((role === 'BARBER' || role === 'CASHIER') && !branchId) {
      throw new AppNotFoundException('NOT_FOUND_BRANCH');
    }

    const hash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        password: hash,
        roleId: UniqueRole?.id,
        ...(role === 'BARBER' && {
          barber: { create: { branchId: branchId! } },
        }),
        ...(role === 'CASHIER' && {
          cashier: { create: { branchId: branchId! } },
        }),
        ...(role === 'CLIENT' && {
          client: { create: {} },
        }),
        ...(role === 'ADMIN' && {
          admin: { create: {} },
        }),
      },
      select: this.userQuery.USER_SELECT,
    });
  }

  async update(id: string, dto: UpdateUserDto, file?: Express.Multer.File) {
    await this.userQuery.findOne(id);

    let avatarUrl: string | undefined;
    let publicId: string | undefined;

    if (file) {
      const uploaded = await this.cloudinary.upload(file.buffer, 'avatars');
      avatarUrl = uploaded.url;
      publicId = uploaded.publicId;
    }

    const data: any = { ...dto, ...(avatarUrl && { avatar: avatarUrl }) };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: this.userQuery.USER_SELECT,
      });
    } catch (err) {
      if (publicId) await this.cloudinary.delete(publicId);
      throw err;
    }
  }

  async remove(id: string) {
    await this.userQuery.findOne(id);
    await this.prisma.user.update({ where: { id }, data: { deleted: true } });
    return { message: 'User deleted' };
  }
}
