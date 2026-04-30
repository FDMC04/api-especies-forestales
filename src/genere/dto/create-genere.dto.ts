import { IsArray, IsString, MinLength } from "class-validator";
import { Family } from "src/families/entities/family.entity";

export class CreateGenereDto {
  @IsString()
  @MinLength(5)
  scientific_name: string;

  @IsString()
  @MinLength(5)
  common_name: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  @IsArray()
  characteristic: string[];

  @IsString()
  family: Family;
}
