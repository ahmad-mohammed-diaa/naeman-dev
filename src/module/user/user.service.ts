import { Injectable } from '@nestjs/common';
import { UserQueryService } from './services/user-query.service';
import { UserManageService } from './services/user-manage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly query: UserQueryService,
    private readonly manage: UserManageService,
  ) {}

  findAll(page?: number, limit?: number) { return this.query.findAll({ page, limit }); }
  findOne(id: string) { return this.query.findOne(id); }
  findMe(id: string) { return this.query.findOne(id); }
  create(dto: CreateUserDto) { return this.manage.create(dto); }
  update(id: string, dto: UpdateUserDto, file?: Express.Multer.File) { return this.manage.update(id, dto, file); }
  remove(id: string) { return this.manage.remove(id); }
}
