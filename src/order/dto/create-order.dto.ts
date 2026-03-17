import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
  ValidateIf,
  Length,
} from 'class-validator';
import { OrderStatus, BookingStatus } from 'generated/prisma/client';

export class CreateOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(10, 16)
  phone: string;

  @ApiProperty()
  @IsString()
  date: Date;

  @ApiProperty()
  @IsString()
  slot: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  barberId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  barberName?: string;

  @ApiProperty({ type: [String] })
  @ValidateIf((d) => !d.package && !d.service)
  @IsArray()
  @IsString({ each: true })
  service: string[];

  @ApiProperty({ type: [String] })
  @ValidateIf((d) => !d.package && !d.service)
  @IsArray()
  @IsString({ each: true })
  packages: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  branchId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsString()
  note?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsInt()
  @Min(0)
  points?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  usedPackage?: string[];

  @ApiProperty({ enum: OrderStatus, required: false })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ enum: BookingStatus, required: false })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsEnum(BookingStatus)
  booking?: BookingStatus;
}
