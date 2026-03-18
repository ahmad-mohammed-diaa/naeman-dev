import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateAboutDto {
  @ApiProperty() @IsString() @IsNotEmpty() content: string;
  @ApiProperty() @IsString() @IsNotEmpty() location: string;
  @ApiProperty() @IsString() @IsNotEmpty() time: string;
}

export class CreateQuestionDto {
  @ApiProperty() @IsUUID() @IsOptional() id?: string;
  @ApiProperty() @IsString() @IsNotEmpty() question: string;
  @ApiProperty() @IsString() @IsNotEmpty() answer: string;
}

export class CreateStaticDto {
  @ApiProperty() @IsOptional() about?: CreateAboutDto;
  @ApiProperty() @IsOptional() @IsArray() questions?: CreateQuestionDto[];
}
