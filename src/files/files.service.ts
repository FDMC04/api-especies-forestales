import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticRegionsImage(imageName: string) {
    const path = join(__dirname, '../../static/regions', imageName);
    if (!existsSync(path))
      throw new BadRequestException(`No region found with image ${imageName}`);
    return path;
  }

  getStaticSpecieImage(imageName: string) {
    const path = join(__dirname, '../../static/species', imageName);
    if (!existsSync(path))
      throw new BadRequestException(`No specie found with image ${imageName}`);
    return path;
  }
}
