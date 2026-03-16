import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MockService } from './mock.service';
import { MockSwagger } from './mock.swagger';

@ApiTags('Mock')
@Controller('v1/mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  @MockSwagger.get()
  @Get()
  get() {
    return this.mockService.createMockClientData();
  }
}
