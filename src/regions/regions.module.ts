import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionImage, Regions } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService],
  imports: [TypeOrmModule.forFeature([Regions, RegionImage]), AuthModule],
})
export class RegionsModule {}
