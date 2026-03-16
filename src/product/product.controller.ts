import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/update-product.dto';
import { multerConfig } from '../../src/config/multer.config';
import { ProductSwagger } from './product.swagger';

@ApiTags('Product')
@Controller('v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ProductSwagger.createProduct()
  @UseInterceptors(FileInterceptor('file', multerConfig('products')))
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.createProduct(createProductDto, file);
  }

  @ProductSwagger.getAllProducts()
  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ProductSwagger.getProductById()
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @ProductSwagger.updateProduct()
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @ProductSwagger.deleteProduct()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
