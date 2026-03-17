import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllCashiersQueryDto {
  @ApiProperty({ type: String, required: false, description: 'Branch ID to filter cashiers' })
  @IsOptional()
  @IsString()
  branchId?: string;
}
