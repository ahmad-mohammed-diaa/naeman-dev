import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { PointsQueryService } from './services/points-query.service';

@Module({
  controllers: [PointsController],
  providers: [PointsService, PointsQueryService],
})
export class PointsModule {}
