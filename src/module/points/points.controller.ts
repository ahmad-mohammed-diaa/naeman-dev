import { Controller, Get, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PointsSwagger } from './points.swagger';
import { type User } from 'generated/prisma/client';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v2/points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @PointsSwagger.myPoints()
  @Get('my')
  @Permissions('view:points')
  myPoints(@CurrentUser() user: User) {
    return this.pointsService.getClientPoints(user.id);
  }

  @PointsSwagger.myTransactions()
  @Get('my/transactions')
  @Permissions('view:points')
  myTransactions(@CurrentUser() user: User) {
    return this.pointsService.getTransactions(user.id);
  }
}
