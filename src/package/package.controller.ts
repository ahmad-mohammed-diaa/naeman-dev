import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { AuthGuard } from 'guard/auth.guard';
import { RolesGuard } from 'guard/role.guard';
import { Roles } from 'decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../src/config/multer.config';
import { Lang } from 'decorators/accept.language';
import { Language } from 'generated/prisma/client';
import { PackageSwagger } from './package.swagger';

@ApiTags('Package')
@UseGuards(AuthGuard(), RolesGuard)
@Controller('v1/package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @PackageSwagger.create()
  @UseInterceptors(FileInterceptor('file', multerConfig('packages')))
  @Post()
  create(
    @Body() createPackageDto: CreatePackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.packageService.create(createPackageDto, file);
  }

  @PackageSwagger.findAll()
  @Get()
  findAll(@Lang() language: Language) {
    return this.packageService.findAll(language);
  }

  @PackageSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string, @Lang() language: Language) {
    return this.packageService.findOne(id, language);
  }

  @PackageSwagger.update()
  @Roles(['ADMIN'])
  @Put(':id')
  update(@Param('id') id: string) {
    return this.packageService.update(id);
  }

  @PackageSwagger.remove()
  @Delete('delete-many')
  remove(@Param('id') _id: string) {
    return this.packageService.remove();
  }
}
