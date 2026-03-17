import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';

export enum UserRoleName {
  ADMIN = 'ADMIN',
  BARBER = 'BARBER',
  CASHIER = 'CASHIER',
  CLIENT = 'CLIENT',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRoleName })
  @IsEnum(UserRoleName)
  role: UserRoleName;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  branchId?: string; // required for BARBER and CASHIER
}
