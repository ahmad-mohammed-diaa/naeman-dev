import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { CheckPasswordDto } from './dto/check-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnalyticsSwagger } from './analytics.swagger';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v2/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @AnalyticsSwagger.get()
  @Get()
  @Permissions('view:analytics')
  getAnalytics(
    @CurrentUser() user: { id: string; roleName: string },
    @Query() query: AnalyticsQueryDto,
  ) {
    const from = query.fromDate ? new Date(query.fromDate) : undefined;
    const to = query.toDate ? new Date(query.toDate) : undefined;
    return this.analyticsService.getAnalytics(user.roleName, from, to);
  }

  @AnalyticsSwagger.checkPassword()
  @Post('check-password')
  @Permissions('view:analytics')
  checkPassword(@Body() dto: CheckPasswordDto) {
    return this.analyticsService.checkPassword(dto.password);
  }
}
