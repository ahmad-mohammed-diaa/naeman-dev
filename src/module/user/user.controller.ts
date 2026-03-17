import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { UserSwagger } from './user.swagger';
import { UploadFile } from '../../common/decorators/upload.decorator';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v2/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UserSwagger.findAll()
  @Get()
  @Permissions('view:users')
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.userService.findAll(page, limit);
  }

  @UserSwagger.findOne()
  @Get(':id')
  @Permissions('view:users')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UserSwagger.create()
  @Post()
  @Permissions('create:users')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UserSwagger.update()
  @UploadFile('avatar')
  @Patch(':id')
  @Permissions('edit:users')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.update(id, dto, file);
  }

  @UserSwagger.remove()
  @Delete(':id')
  @Permissions('delete:users')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
