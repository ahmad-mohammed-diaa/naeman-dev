import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsInt,
  IsIn,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ahmed' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+966500000000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'CLIENT',
    enum: ['ADMIN', 'CLIENT', 'BARBER', 'CASHIER'],
    required: false,
  })
  @IsIn(['ADMIN', 'CLIENT', 'BARBER', 'CASHIER'])
  @IsOptional()
  role?: string;

  @ApiProperty({
    required: false,
    description:
      'Referral code of the person who referred this client (CLIENT only)',
  })
  @IsString()
  @IsOptional()
  referralCode?: string;

  @ApiProperty({
    required: false,
    description: 'Branch ID — required for BARBER / CASHIER roles',
  })
  @ValidateIf((o: RegisterDto) => o.role === 'BARBER' || o.role === 'CASHIER')
  @IsString()
  @IsNotEmpty()
  branchId?: string;

  @ApiProperty({
    required: false,
    description:
      'Shift start in minutes from midnight (e.g. 540 = 9:00 AM) — required for BARBER / CASHIER',
  })
  @ValidateIf((o: RegisterDto) => o.role === 'BARBER' || o.role === 'CASHIER')
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  start?: number;

  @ApiProperty({
    required: false,
    description:
      'Shift end in minutes from midnight (e.g. 1020 = 5:00 PM) — required for BARBER / CASHIER',
  })
  @ValidateIf((o: RegisterDto) => o.role === 'BARBER' || o.role === 'CASHIER')
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  end?: number;

  @ApiProperty({
    required: false,
    description: 'Barber type — BARBER role only (default: GENERAL)',
    example: 'GENERAL',
  })
  @IsString()
  @IsOptional()
  type?: string;
}
