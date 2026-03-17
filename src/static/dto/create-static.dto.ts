// src/static/static.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateAboutDto {
  @ApiProperty()
  @IsString() @IsNotEmpty() content: string;
  @ApiProperty()
  @IsString() @IsNotEmpty() location: string;
  @ApiProperty()
  @IsString() @IsNotEmpty() time: string;
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsString() @IsNotEmpty() question: string;
  @ApiProperty()
  @IsString() @IsNotEmpty() answer: string;
}

export class CreateStaticDto {
  @ApiProperty({ type: CreateAboutDto, required: false })
  @IsOptional() about?: CreateAboutDto;
  @ApiProperty({ type: [CreateQuestionDto], required: false })
  @IsOptional() @IsArray() questions?: CreateQuestionDto[];
}
