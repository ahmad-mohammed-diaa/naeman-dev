import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserQueryService } from './services/user-query.service';
import { UserManageService } from './services/user-manage.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserQueryService, UserManageService],
  exports: [UserService],
})
export class UserModule {}
