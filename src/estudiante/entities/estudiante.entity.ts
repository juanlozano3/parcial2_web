import { Actividad } from 'src/actividad/entities/actividad.entity';
import { Resenia } from 'src/resenia/entities/resenia.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column()
  semestre: number;

  @ManyToMany(() => Actividad, (actividad) => actividad.inscritos)
  actividades: Actividad[];

  @OneToMany(() => Resenia, (resenia) => resenia.estudiante)
  resenias: Resenia[];
}
