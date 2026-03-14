import { PackagesStatus } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateClientPackageDto {
  @IsEnum(PackagesStatus)
  type: string;
}
