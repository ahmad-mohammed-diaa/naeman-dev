import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ServiceSwagger } from './service.swagger';

@Controller('v2/services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @ServiceSwagger.findAll()
  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.serviceService.findAll(categoryId);
  }

  @ServiceSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @ServiceSwagger.create()
  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('create:services')
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @ServiceSwagger.update()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:services')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.serviceService.update(id, dto);
  }

  @ServiceSwagger.remove()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('delete:services')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}
