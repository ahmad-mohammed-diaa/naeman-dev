import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientPackagesService } from './client-packages.service';
import { Language } from 'generated/prisma/client';
import { AuthGuard } from 'guard/auth.guard';
import { Lang } from 'decorators/accept.language';
import { ClientPackagesSwagger } from './client-packages.swagger';
import { CreateClientPackageQueryDto } from './dto/create-client-package-query.dto';
import { CreateClientPackageBodyDto } from './dto/create-client-package-body.dto';

@ApiTags('Client Packages')
@UseGuards(AuthGuard())
@Controller('v1/client-packages')
export class ClientPackagesController {
  constructor(private readonly clientPackagesService: ClientPackagesService) {}

  @ClientPackagesSwagger.create()
  @Post()
  create(
    @Body() body: CreateClientPackageBodyDto,
    @Query() query: CreateClientPackageQueryDto,
    @Lang() lang: Language,
  ) {
    return this.clientPackagesService.create(query.packageId, body.phone, lang);
  }

  @ClientPackagesSwagger.findAll()
  @Get()
  findAll(@Lang() language: Language) {
    return this.clientPackagesService.findAll(language);
  }

  @ClientPackagesSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string, @Lang() language: Language) {
    return this.clientPackagesService.findOne(id, language);
  }

  @ClientPackagesSwagger.update()
  @Patch(':id')
  update(@Param('id') id: string) {
    return this.clientPackagesService.update(+id);
  }

  @ClientPackagesSwagger.remove()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientPackagesService.remove(id);
  }
}
