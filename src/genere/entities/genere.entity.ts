import { Family } from 'src/families/entities/family.entity';
import { Species } from 'src/species/entities/species.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'generes' })
export class Genere {
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

  @Column('text', {
    array: true,
  })
  characteristic: string[];

  @ManyToOne(() => Family, (family) => family.genere)
  family: Family;

  @OneToMany(() => Species, (species) => species.genere, {
    eager: true,
  })
  species: Species[];
}
