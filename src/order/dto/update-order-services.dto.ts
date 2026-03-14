import { IsArray, IsString } from 'class-validator';

export class UpdateOrderServicesDto {
  @IsArray()
  @IsString({ each: true })
  serviceToDelete: string[];
}
