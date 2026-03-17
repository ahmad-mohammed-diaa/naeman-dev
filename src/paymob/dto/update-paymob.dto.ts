import { PartialType } from '@nestjs/swagger';
import { CreatePaymobDto } from './create-paymob.dto';

export class UpdatePaymobDto extends PartialType(CreatePaymobDto) {}
