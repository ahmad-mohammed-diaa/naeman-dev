import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  question: string;

  @IsString()
  answer: string;
}

export class UpdateStaticDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];
}
