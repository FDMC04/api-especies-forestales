import { Genere } from 'src/genere/entities/genere.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpeciesImage } from './species-image.entity';

@Entity({ name: 'species' })
export class Species {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  scientific_name: string;

  @Column('text', {
    unique: true,
  })
  common_name: string;

  @Column('text')
  description: string;

  @Column('text')
  height: string;

  @Column('text')
  type: string;

  @OneToMany(() => SpeciesImage, (speciesImage) => speciesImage.species, {
    cascade: true,
    eager: true,
  })
  images?: SpeciesImage[];

  @ManyToOne(() => Genere, (genere) => genere.species)
  genere: Genere;
}
