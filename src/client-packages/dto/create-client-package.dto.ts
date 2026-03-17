import { ApiProperty } from '@nestjs/swagger';
import { PackagesStatus } from 'generated/prisma/client';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateClientPackageDto {
  @ApiProperty({ enum: PackagesStatus })
  @IsEnum(PackagesStatus)
  type: string;
}
