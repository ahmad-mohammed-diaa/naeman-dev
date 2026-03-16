import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Put,
  Post,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from 'guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUpdateDto } from './dto/user-update-dto';
import { RateBarberDto } from './dto/rate-barber.dto';
import { UserData } from 'decorators/user.decorator';
import { Role, User } from 'generated/prisma/client';
import { multerConfig } from 'src/config/multer.config';
import { UserSwagger } from './user.swagger';

@ApiTags('User')
@Controller('v1/user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UserSwagger.unbanUser()
  @Put('unban')
  unbanUser(@Body('number') number: string) {
    return this.userService.unbanUser(number);
  }

  @UserSwagger.findAll()
  @Get()
  findAll(
    @Query()
    { role, page, pageSize }: { role?: Role; page: number; pageSize: number },
  ) {
    return this.userService.findAllUser(page, pageSize, role);
  }

  @UserSwagger.findAllClients()
  @Get('clients')
  findAllClients(
    @Query()
    {
      page,
      pageSize,
      phone,
    }: {
      page: number;
      pageSize: number;
      phone?: string;
    },
  ) {
    return this.userService.findAllClients(page, pageSize, phone);
  }

  @UserSwagger.update()
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', multerConfig('avatars')))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UserUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUser(id, user, file);
  }

  @UserSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneUser(id);
  }

  @UserSwagger.currentUser()
  @Get('current/profile')
  CurrentUser(@UserData('user') user: User) {
    return this.userService.CurrentUser(user);
  }

  @UserSwagger.delete()
  @Delete('deleteAccount')
  delete(@UserData('user') _user: User, @Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UserSwagger.deleteEmployee()
  @Delete('deleteEmployeeAccount/:id')
  deleteEmployee(@UserData('user') _user: User, @Param('id') id: string) {
    return this.userService.deleteEmployee(id);
  }

  @UserSwagger.rateBarber()
  @Post('rate-barber')
  rateBarber(
    @UserData('user') user: User,
    @Body() rateBarberDto: RateBarberDto,
  ) {
    return this.userService.rateBarber(
      user.id,
      rateBarberDto.barberId,
      rateBarberDto.rating,
    );
  }
}
