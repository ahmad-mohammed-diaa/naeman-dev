import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClientPackageQueryDto {
  @ApiProperty({ type: String, required: true, description: 'Package ID to assign to the client' })
  @IsString()
  packageId: string;
}
