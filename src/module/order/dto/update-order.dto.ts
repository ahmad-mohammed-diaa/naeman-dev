import { IsArray, IsString, IsOptional } from 'class-validator';

export class BarberUpdateOrderDto {
  @IsArray()
  @IsString({ each: true })
  serviceIds: string[]; // new complete list of service IDs
}

export class CancelOrderDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
