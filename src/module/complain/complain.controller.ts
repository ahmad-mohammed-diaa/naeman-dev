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
import { ComplainService } from './complain.service';
import { CreateComplainDto } from './dto/create-complain.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ComplainSwagger } from './complain.swagger';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v2/complaints')
export class ComplainController {
  constructor(private readonly complainService: ComplainService) {}

  @ComplainSwagger.create()
  @Post()
  @Permissions('create:complaints')
  create(@Body() dto: CreateComplainDto, @CurrentUser() user: { id: string }) {
    return this.complainService.create(dto, user.id);
  }

  @ComplainSwagger.findAll()
  @Get()
  @Permissions('view:complaints')
  findAll() {
    return this.complainService.findAll();
  }

  @ComplainSwagger.findOne()
  @Get(':id')
  @Permissions('view:complaints')
  findOne(@Param('id') id: string) {
    return this.complainService.findOne(id);
  }

  @ComplainSwagger.resolve()
  @Patch(':id/resolve')
  @Permissions('edit:complaints')
  resolve(@Param('id') id: string) {
    return this.complainService.resolve(id);
  }

  @ComplainSwagger.remove()
  @Delete(':id')
  @Permissions('delete:complaints')
  remove(@Param('id') id: string) {
    return this.complainService.remove(id);
  }
}
