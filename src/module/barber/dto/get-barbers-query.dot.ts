import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class FindBarbersQuery {
  @IsString()
  @IsOptional()
  branchId?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeUnavailable?: boolean;
}
