import { IsArray, IsString } from 'class-validator';

export class AvailableSlotQuery {
  @IsString() barberId: string;
  @IsString() date: string;
  @IsArray({ each: true }) serviceIds: string[];
}
