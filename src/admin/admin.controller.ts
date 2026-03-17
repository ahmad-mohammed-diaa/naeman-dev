import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'guard/auth.guard';
import { RolesGuard } from 'guard/role.guard';
import { Roles } from 'decorators/roles.decorator';
import { UserData } from 'decorators/user.decorator';
import { User } from 'generated/prisma/client';
import { AdminSwagger } from './admin.swagger';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { CheckPasswordBodyDto } from './dto/check-password-body.dto';

@ApiTags('Admin')
@Controller('v1/admin')
@UseGuards(AuthGuard(), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @AdminSwagger.create()
  @Roles(['ADMIN'])
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @AdminSwagger.findAll()
  @Roles(['ADMIN'])
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @AdminSwagger.getAnalytics()
  @Roles(['ADMIN', 'CASHIER'])
  @Get('/analytics')
  getAnalytics(
    @UserData('user') { role }: User,
    @Query() query: AnalyticsQueryDto,
  ) {
    const from = query.fromDate ? new Date(query.fromDate) : undefined;
    const to = query.toDate ? new Date(query.toDate) : undefined;
    return this.adminService.getBarberOrdersWithCounts(role, from, to);
  }

  @AdminSwagger.update()
  @Roles(['ADMIN'])
  @Put()
  update(@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(updateAdminDto);
  }

  @AdminSwagger.checkPassword()
  @Roles(['ADMIN', 'CASHIER'])
  @Post('/check-password')
  checkPassword(@Body() body: CheckPasswordBodyDto) {
    return this.adminService.CheckPassword(body.password);
  }
}
