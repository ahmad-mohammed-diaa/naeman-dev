import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ClientSwagger } from './client.swagger';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('v2/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ClientSwagger.findAll()
  @Get()
  @Permissions('view:clients')
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.clientService.findAll(page, limit);
  }

  @ClientSwagger.findOne()
  @Get(':id')
  @Permissions('view:clients')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @ClientSwagger.ban()
  @Patch(':id/ban')
  @Permissions('edit:clients')
  ban(@Param('id') id: string) {
    return this.clientService.ban(id);
  }

  @ClientSwagger.unban()
  @Patch(':id/unban')
  @Permissions('edit:clients')
  unban(@Param('id') id: string) {
    return this.clientService.unban(id);
  }

  @ClientSwagger.remove()
  @Delete(':id')
  @Permissions('delete:clients')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
