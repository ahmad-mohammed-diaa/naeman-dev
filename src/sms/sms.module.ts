import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SmsController],
  providers: [SmsService],
  imports: [AuthModule],
})
export class SmsModule {}
