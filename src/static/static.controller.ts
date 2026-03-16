import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StaticService } from './static.service';
import { CreateAboutDto, CreateQuestionDto } from './dto/create-static.dto';
import { UpdateStaticDto } from './dto/update-static.dto';
import { StaticSwagger } from './static.swagger';

@ApiTags('Static')
@Controller('v1/static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @StaticSwagger.createAbout()
  @Post('/about')
  createAbout(@Body() data: CreateAboutDto) {
    return this.staticService.createAbout(data);
  }

  @StaticSwagger.createQuestions()
  @Post('/questions')
  createQuestions(@Body() data: CreateQuestionDto) {
    return this.staticService.createQuestions(data);
  }

  @StaticSwagger.getStatic()
  @Get()
  getStatic() {
    return this.staticService.getStatic();
  }

  @StaticSwagger.updateAbout()
  @Put('/about')
  updateAbout(@Body() data: UpdateStaticDto) {
    return this.staticService.updateAbout(data);
  }

  @StaticSwagger.updateQuestion()
  @Put('question/:id')
  updateQuestion(@Param('id') id: string, @Body() data: CreateQuestionDto) {
    return this.staticService.updateQuestion(id, data);
  }

  @StaticSwagger.deleteQuestion()
  @Delete('question/:id')
  deleteQuestion(@Param('id') id: string) {
    return this.staticService.deleteQuestion(id);
  }
}
