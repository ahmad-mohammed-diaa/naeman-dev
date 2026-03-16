import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { UserData } from 'decorators/user.decorator';
import { Language, User } from 'generated/prisma/client';
import { AuthGuard } from 'guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { Lang } from '../../decorators/accept.language';
import { PointsSwagger } from './points.swagger';

@ApiTags('Points')
@UseGuards(AuthGuard())
@Controller('v1/points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @PointsSwagger.create()
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig('packages')))
  create(
    @Body() createPointDto: CreatePointDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.pointsService.createPoints(createPointDto, file);
  }

  @PointsSwagger.findAll()
  @Get()
  findAll(@Lang() lang: Language) {
    return this.pointsService.findAll(lang);
  }

  @PointsSwagger.purchasePoint()
  @Post('/purchase/:pointId')
  purchasePoint(
    @UserData('user') user: User,
    @Param('pointId') pointId: string,
  ) {
    return this.pointsService.purchasePoint(user, pointId);
  }

  @PointsSwagger.findOne()
  @Get(':id')
  findOne(@Param('id') id: string, @Lang() lang: Language) {
    return this.pointsService.findOne(id, lang);
  }

  @PointsSwagger.update()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePointDto: UpdatePointDto,
    @Lang() lang: Language,
  ) {
    return this.pointsService.update(id, updatePointDto, lang);
  }

  @PointsSwagger.remove()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointsService.remove(+id);
  }
}
