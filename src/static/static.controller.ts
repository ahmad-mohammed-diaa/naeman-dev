import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StaticService } from './static.service';
import { CreateAboutDto, CreateQuestionDto } from './dto/create-static.dto';
import { UpdateStaticDto } from './dto/update-static.dto';

@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Post('/about')
  createAbout(@Body() data: CreateAboutDto) {
    return this.staticService.createAbout(data);
  }

  @Post('/questions')
  createQuestions(@Body() data: CreateQuestionDto) {
    return this.staticService.createQuestions(data);
  }

  @Get()
  getStatic() {
    return this.staticService.getStatic();
  }

  @Put('/about')
  updateAbout(@Body() data: UpdateStaticDto) {
    return this.staticService.updateAbout(data);
  }

  @Put('question/:id')
  updateQuestion(@Param('id') id: string, @Body() data: CreateQuestionDto) {
    return this.staticService.updateQuestion(id, data);
  }

  @Delete('question/:id') deleteQuestion(@Param('id') id: string) {
    return this.staticService.deleteQuestion(id);
  }
}
