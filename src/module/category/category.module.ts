import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryQueryService } from './services/category-query.service';
import { CategoryManageService } from './services/category-manage.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryQueryService, CategoryManageService],
  exports: [CategoryService],
})
export class CategoryModule {}
