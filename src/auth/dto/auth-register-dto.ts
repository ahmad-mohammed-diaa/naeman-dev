import { CategoryType, Role } from 'generated/prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John', required: true, description: 'First name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', required: true, description: 'Last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsString()
  avatar: string;

  @ApiProperty({
    example: '+966500000000',
    required: true,
    description: 'Phone number',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 16)
  phone: string;

  @ApiProperty({ example: '123456', required: true, description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '123456',
    required: true,
    description: 'Referral code optional and only for clients',
  })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsString()
  referralCode: string;

  @ApiProperty({
    example: 'ADMIN',
    required: true,
    description: 'choose role from [ADMIN, CLIENT, BARBER, CASHIER]',
  })
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @IsString()
  role: Role;

  @ApiProperty({
    example: '123456',
    required: true,
    description: 'Branch id optional and only for cashiers and barbers',
  })
  @ValidateIf(
    (object) =>
      object?.role?.toUpperCase() === 'CASHIER' ||
      object?.role?.toUpperCase() === 'BARBER',
  )
  @Transform(({ value }) => value ?? null)
  @IsNotEmpty()
  @IsString()
  branchId: string;

  @ApiProperty({
    example: [
      {
        id: '1',
        dates: ['2022-01-01', '2022-01-02'],
        month: '2022-01',
      },
    ],
    required: true,
    description: 'vacations optional and only for cashiers and barbers',
  })
  @IsArray()
  @IsOptional()
  @ValidateIf((o) => ['CASHIER', 'BARBER'].includes(o?.role?.toUpperCase()))
  vacations: Vacation[];

  @ApiProperty({
    example: 'BARBER',
    required: true,
    description: 'Type of Barber [GENERAL, MASSAGE, PEDICURE]',
  })
  @ValidateIf((o) => ['BARBER'].includes(o?.role?.toUpperCase()))
  @IsNotEmpty({ message: 'Type is required' })
  @Transform(({ value }: { value: string }) => value?.toUpperCase())
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiProperty({
    example: '10',
    required: true,
    description: 'Shift start time optional and only for cashiers and barbers',
  })
  @ValidateIf((o) => ['CASHIER', 'BARBER'].includes(o?.role?.toUpperCase()))
  @Transform(({ value }) => {
    const num = Number(value);
    return !Number.isNaN(num) ? num : undefined;
  })
  @IsNotEmpty({ message: 'Start time is required' })
  @IsInt({ message: 'Start must be a whole number' })
  start: number;

  @ApiProperty({
    example: '10',
    required: true,
    description: 'Shift end time optional and only for cashiers and barbers',
  })
  @ValidateIf((o) => ['CASHIER', 'BARBER'].includes(o?.role?.toUpperCase()))
  @Transform(({ value }) => {
    const num = Number(value);
    return !Number.isNaN(num) ? num : undefined;
  })
  @IsNotEmpty({ message: 'End time is required' })
  @IsInt({ message: 'End must be a whole number' })
  end: number;
}

export class Vacation {
  @IsString()
  id: string;

  @IsArray()
  @IsNotEmpty()
  dates: string[];

  @IsString()
  month: string;
}
