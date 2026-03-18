import { Module } from '@nestjs/common';
import { ComplainController } from './complain.controller';
import { ComplainService } from './complain.service';

@Module({
  controllers: [ComplainController],
  providers: [ComplainService],
})
export class ComplainModule {}
