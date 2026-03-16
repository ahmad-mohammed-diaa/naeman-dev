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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { BranchSwagger } from './branch.swagger';
import { Lang } from '@/common/decorators/lang.decorator';
import { Language } from 'generated/prisma/enums';

@Controller('v1/branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @BranchSwagger.findAll()
  @Get()
  findAll(@Lang() lang: Language) {
    return this.branchService.findAll(lang);
  }

  @BranchSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string, @Lang() lang: Language) {
    return this.branchService.findOne(id, lang);
  }

  @BranchSwagger.create()
  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('create:branches')
  create(@Body() dto: CreateBranchDto, @Lang() lang: Language) {
    return this.branchService.create(dto, lang);
  }

  @BranchSwagger.update()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:branches')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
    @Lang() lang: Language,
  ) {
    return this.branchService.update(id, dto, lang);
  }

  @BranchSwagger.remove()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('delete:branches')
  remove(@Param('id') id: string, @Lang() lang: Language) {
    return this.branchService.remove(id, lang);
  }
}
