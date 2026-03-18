import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { StaticService } from './static.service';
import { UpdateStaticDto } from './dto/update-static.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { StaticSwagger } from './static.swagger';

@Controller('v2/static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @StaticSwagger.get()
  @Get()
  get() {
    return this.staticService.get();
  }

  @StaticSwagger.update()
  @Patch()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('edit:static', 'create:static')
  update(@Body() dto: UpdateStaticDto) {
    return this.staticService.CreateUpdateStatic(dto);
  }
}
