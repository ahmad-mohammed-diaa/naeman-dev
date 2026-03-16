import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { CategoryQueryService } from './services/category-query.service';
import { CategoryManageService } from './services/category-manage.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryQuery: CategoryQueryService,
    private readonly categoryManage: CategoryManageService,
  ) {}

  findAll() {
    return this.categoryQuery.findAll();
  }

  findOne(id: string) {
    return this.categoryQuery.findOne(id);
  }

  create(dto: CreateCategoryDto) {
    return this.categoryManage.create(dto);
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.categoryManage.update(id, dto);
  }

  remove(id: string) {
    return this.categoryManage.remove(id);
  }
}
