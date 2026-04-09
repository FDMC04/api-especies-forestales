import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Regions } from './regions.entity';

@Entity({ name: 'region_image' })
export class RegionImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;
  @ManyToOne(() => Regions, (regions) => regions.images, {
    onDelete: 'CASCADE',
  })
  regions: Regions;
}
