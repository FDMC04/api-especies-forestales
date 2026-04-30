import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genere } from 'src/genere/entities/genere.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Species, SpeciesImage } from './entities';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [SpeciesController],
  providers: [SpeciesService],
  imports: [
    TypeOrmModule.forFeature([Species, SpeciesImage, Genere]),
    AuthModule,
    FilesModule,
  ],
  exports: [SpeciesService, TypeOrmModule],
})
export class SpeciesModule {}
