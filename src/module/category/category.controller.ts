import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CategorySwagger } from './category.swagger';

@Controller('v2/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @CategorySwagger.findAll()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @CategorySwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @CategorySwagger.create()
  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('create:categories')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @CategorySwagger.update()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:categories')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @CategorySwagger.remove()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('delete:categories')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
