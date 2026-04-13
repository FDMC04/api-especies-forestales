import { Genere } from 'src/genere/entities/genere.entity';
import { Regions } from 'src/regions/entities';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'families' })
export class Family {
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

  @ManyToMany(() => Regions, (region) => region.families, {
    eager: true,
  })
  @JoinTable()
  regions?: Regions[];

  @OneToMany(() => Genere, (genere) => genere.family, {
    eager: true,
  })
  genere: Genere[];
}
