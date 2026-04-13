import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Regions } from 'src/regions/entities';

@Module({
  controllers: [FamiliesController],
  providers: [FamiliesService],
  imports: [TypeOrmModule.forFeature([Family, Regions]), AuthModule],
  exports: [FamiliesService, TypeOrmModule],
})
export class FamiliesModule {}
