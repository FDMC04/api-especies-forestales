import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Species } from './species.entity';

@Entity({ name: 'species_images' })
export class SpeciesImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Species, (species) => species.images, {
    onDelete: 'CASCADE',
  })
  species: Species;
}
