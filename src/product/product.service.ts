import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AppSuccess } from 'src/utils/AppSuccess';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  createTranslation,
  updateTranslation,
} from 'src/class-type/translation';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    CreateProductDto: CreateProductDto,
    file: Express.Multer.File,
  ) {
    // const { name, productImg, price, available } = CreateProductDto;

    const productImgUrl = file?.path;

    const product = await this.prisma.product.create({
      data: {
        ...(productImgUrl && { productImg: productImgUrl }),
        ...CreateProductDto,
        Translation: createTranslation(CreateProductDto),
      },
    });

    return new AppSuccess(product, 'Product created successfully', 201);
  }

  async getAllProducts() {
    const products = await this.prisma.product.findMany();
    return new AppSuccess({ products }, 'Products fetched successfully', 200);
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return new AppSuccess(product, 'Product fetched successfully', 200);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const { productImg, price, available } = updateProductDto;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        Translation: updateTranslation(updateProductDto),
        productImg,
        price,
        available,
      },
    });

    return new AppSuccess(product, 'Product updated successfully', 200);
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.delete({
      where: { id },
    });

    return new AppSuccess(product, 'Product deleted successfully', 200);
  }
}
