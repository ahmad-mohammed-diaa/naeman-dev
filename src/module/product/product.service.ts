import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductQueryService } from './services/product-query.service';
import { ProductManageService } from './services/product-manage.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productQuery: ProductQueryService,
    private readonly productManage: ProductManageService,
  ) {}

  findAll() {
    return this.productQuery.findAll();
  }

  findOne(id: string) {
    return this.productQuery.findOne(id);
  }

  create(dto: CreateProductDto, file?: Express.Multer.File) {
    return this.productManage.create(dto, file);
  }

  update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    return this.productManage.update(id, dto, file);
  }

  remove(id: string) {
    return this.productManage.remove(id);
  }
}
