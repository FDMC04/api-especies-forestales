import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegionImage } from './region-image.entity';
import { Family } from 'src/families/entities/family.entity';

@Entity({ name: 'regions' })
export class Regions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    array: true,
  })
  ecosystems: string[];

  @Column('text')
  weather: string;

  @Column('text')
  temperature: string;

  @Column('text')
  precipitation: string;

  @Column('text')
  altitude: string;

  @Column('text', {
    array: true,
  })
  states: string[];

  @OneToMany(() => RegionImage, (regionImage) => regionImage.regions, {
    cascade: true,
    eager: true,
  })
  images?: RegionImage[];

  @ManyToMany(() => Family, (family) => family.regions)
  families?: Family[];
}
