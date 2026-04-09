import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString({ each: true })
  @IsArray()
  ecosystems: string[];

  @IsString()
  weather: string;

  @IsString()
  temperature: string;

  @IsString()
  precipitation: string;

  @IsString()
  altitude: string;

  @IsString({ each: true })
  @IsArray()
  states: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
