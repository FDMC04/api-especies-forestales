import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { Genere } from 'src/genere/entities/genere.entity';

export class CreateSpeciesDto {
  @IsString()
  @MinLength(5)
  scientific_name: string;

  @IsString()
  @MinLength(5)
  common_name: string;

  @IsString()
  description: string;

  @IsString()
  height: string;

  @IsString()
  type: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  genere: Genere;
}
