import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ComplainService } from './complain.service';
import { CreateComplainDto } from './dto/create-complain.dto';
import { UserData } from 'decorators/user.decorator';
import { User } from 'generated/prisma/client';
import { AuthGuard } from 'guard/auth.guard';
import { RolesGuard } from 'guard/role.guard';
import { Roles } from 'decorators/roles.decorator';
import { ComplainSwagger } from './complain.swagger';

@ApiTags('Complain')
@Controller('v1/complain')
@UseGuards(AuthGuard(), RolesGuard)
export class ComplainController {
  constructor(private readonly complainService: ComplainService) {}

  @ComplainSwagger.create()
  @Roles(['USER', 'ADMIN'])
  @Post()
  create(
    @Body() createComplainDto: CreateComplainDto,
    @UserData('user') user: User,
  ) {
    return this.complainService.createComplain(createComplainDto, user);
  }

  @ComplainSwagger.findAll()
  @Roles(['ADMIN'])
  @Get()
  findAll() {
    return this.complainService.getAllComplains();
  }

  @ComplainSwagger.findOne()
  @Roles(['ADMIN'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complainService.findOne(id);
  }

  @ComplainSwagger.update()
  @Roles(['ADMIN'])
  @Put(':id')
  update(@Param('id') id: string) {
    return this.complainService.updateComplain(id);
  }

  @ComplainSwagger.remove()
  @Roles(['ADMIN'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complainService.remove(id);
  }
}
