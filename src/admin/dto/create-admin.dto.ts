import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  PointsPercentage: number;
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  referralPoints: number;
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  pointLimit: number;
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  canceledOrder: number;
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  slotDuration: number;
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  maxDaysBooking: number;
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  maxBookingsPerDay: number;
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
