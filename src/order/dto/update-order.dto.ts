import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsArray()
  add: string[];

  @IsOptional()
  @IsArray()
  remove: string[];

  @IsOptional()
  @IsArray()
  addPackage: string[];

  @IsOptional()
  @IsArray()
  removePackage: string[];
}
