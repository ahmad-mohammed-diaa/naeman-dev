import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';
import { StaticQueryService } from './services/static-query.service';
import { StaticUpdateService } from './services/static-update.service';

@Module({
  controllers: [StaticController],
  providers: [StaticService, StaticQueryService, StaticUpdateService],
})
export class StaticModule {}
