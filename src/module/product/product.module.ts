import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductQueryService } from './services/product-query.service';
import { ProductManageService } from './services/product-manage.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductQueryService, ProductManageService],
})
export class ProductModule {}
