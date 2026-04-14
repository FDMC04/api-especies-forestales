import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('region/:imageName')
  findRegionImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticRegionsImage(imageName);
    res.sendFile(path);
  }

  @Post('region')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/regions',
        filename: fileNamer,
      }),
    }),
  )
  uploadRegionImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that file is an image');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/region/${file.filename}`;
    return { secureUrl, fileName: file.filename };
  }

  @Get('specie/:imageName')
  findSpecieImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticSpecieImage(imageName);
    res.sendFile(path);
  }

  @Post('specie')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/species',
        filename: fileNamer,
      }),
    }),
  )
  uploadSpecieImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that file is an image');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/specie/${file.filename}`;
    return { secureUrl, fileName: file.filename };
  }
}
