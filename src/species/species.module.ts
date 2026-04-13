import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genere } from 'src/genere/entities/genere.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Species, SpeciesImage } from './entities';

@Module({
  controllers: [SpeciesController],
  providers: [SpeciesService],
  imports: [
    TypeOrmModule.forFeature([Species, SpeciesImage, Genere]),
    AuthModule,
  ],
  exports: [SpeciesService, TypeOrmModule],
})
export class SpeciesModule {}
