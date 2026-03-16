import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ProductSwagger } from './product.swagger';
import { UploadFile } from '@/common/decorators/upload.decorator';

@Controller('v2/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ProductSwagger.findAll()
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ProductSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ProductSwagger.create()
  @UploadFile('image')
  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('create:products')
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.create(dto, file);
  }

  @ProductSwagger.update()
  @UploadFile('image')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:products')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.update(id, dto, file);
  }

  @ProductSwagger.remove()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:products')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
