import { ApiDoc } from '../../common/decorators/api-doc.decorator';
import { UpdateStaticDto } from './dto/update-static.dto';
import { StaticResponseDto } from './dto/responses/static-response.dto';

export const StaticSwagger = {
  get: () =>
    ApiDoc({
      summary: 'Get static content (about, FAQ)',
      res: { ok: StaticResponseDto },
    }),
  update: () =>
    ApiDoc({
      summary: 'Update static content',
      auth: true,
      body: UpdateStaticDto,
      res: { ok: StaticResponseDto },
    }),
};
