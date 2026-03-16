import { IsString, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';

export enum UserRoleName {
  ADMIN = 'ADMIN',
  BARBER = 'BARBER',
  CASHIER = 'CASHIER',
  CLIENT = 'CLIENT',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRoleName)
  role: UserRoleName;

  @IsString()
  @IsOptional()
  branchId?: string; // required for BARBER and CASHIER
}
