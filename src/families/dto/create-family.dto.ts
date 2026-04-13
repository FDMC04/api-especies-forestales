import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFamilyDto {
  @IsString()
  @MinLength(5)
  scientific_name: string;

  @IsString()
  @MinLength(5)
  common_name: string;

  @IsString({ each: true })
  @IsArray()
  regions: string[];
}
