import { Actividad } from 'src/actividad/entities/actividad.entity';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
@Entity()
export class Resenia {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  comentario: string;

  @Column()
  calificacion: number;

  @Column()
  fecha: string;

  @ManyToOne(() => Actividad, (actividad) => actividad.resenias)
  actividad: Actividad;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.resenias)
  estudiante: Estudiante;
}
