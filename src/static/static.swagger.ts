import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { CreateAboutDto, CreateQuestionDto } from './dto/create-static.dto';
import { UpdateStaticDto } from './dto/update-static.dto';

export const StaticSwagger = {
  createAbout: () =>
    ApiDoc({
      summary: 'Create about page content',
      body: CreateAboutDto,
    }),
  createQuestions: () =>
    ApiDoc({
      summary: 'Create FAQ questions',
      body: CreateQuestionDto,
    }),
  getStatic: () =>
    ApiDoc({
      summary: 'Get static content (about + FAQ)',
    }),
  updateAbout: () =>
    ApiDoc({
      summary: 'Update about page content',
      body: UpdateStaticDto,
    }),
  updateQuestion: () =>
    ApiDoc({
      summary: 'Update a FAQ question',
      params: [{ name: 'id', description: 'Question ID' }],
      body: CreateQuestionDto,
    }),
  deleteQuestion: () =>
    ApiDoc({
      summary: 'Delete a FAQ question',
      params: [{ name: 'id', description: 'Question ID' }],
    }),
};
