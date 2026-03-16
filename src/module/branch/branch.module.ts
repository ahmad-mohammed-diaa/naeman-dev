import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { BranchQueryService } from './services/branch-query.service';
import { BranchManageService } from './services/branch-manage.service';

@Module({
  controllers: [BranchController],
  providers: [BranchService, BranchQueryService, BranchManageService],
  exports: [BranchService],
})
export class BranchModule {}
