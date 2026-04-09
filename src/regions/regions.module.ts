import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionImage, Regions } from './entities';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService],
  imports: [TypeOrmModule.forFeature([Regions, RegionImage])],
})
export class RegionsModule {}
