import { Module } from '@nestjs/common';
import { GenereService } from './genere.service';
import { GenereController } from './genere.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genere } from './entities/genere.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Family } from 'src/families/entities/family.entity';

@Module({
  controllers: [GenereController],
  providers: [GenereService],
  imports: [TypeOrmModule.forFeature([Genere, Family]), AuthModule],
  exports: [GenereService, TypeOrmModule],
})
export class GenereModule {}
