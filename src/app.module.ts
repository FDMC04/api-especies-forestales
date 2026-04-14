import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsModule } from './regions/regions.module';
import { FamiliesModule } from './families/families.module';
import { GenereModule } from './genere/genere.module';
import { SpeciesModule } from './species/species.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    RegionsModule,
    FamiliesModule,
    GenereModule,
    SpeciesModule,
    AuthModule,
    FilesModule,
  ],
})
export class AppModule {}
