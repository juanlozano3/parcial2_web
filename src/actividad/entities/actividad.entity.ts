import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Resenia } from 'src/resenia/entities/resenia.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
@Entity()
export class Actividad {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column()
  cupoMax: number;

  @Column()
  estado: number;

  @ManyToMany(() => Estudiante, (estudiante) => estudiante.actividades)
  @JoinTable()
  inscritos: Estudiante[];

  @OneToMany(() => Resenia, (resenia) => resenia.actividad)
  resenias: Resenia[];
}
