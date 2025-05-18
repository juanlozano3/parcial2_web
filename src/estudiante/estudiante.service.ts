import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Estudiante } from './entities/estudiante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from 'src/actividad/entities/actividad.entity';
@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async crearEstudiante(data: Partial<Estudiante>): Promise<Estudiante> {
    const { correo, semestre } = data;
    if (correo === undefined || semestre === undefined) {
      throw new BadRequestException('Datos incompletos');
    }
    if (semestre < 1 || semestre > 10) {
      throw new BadRequestException('No cumple los requisitos');
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
      throw new BadRequestException('No cumple los requisitos');
    }
    const nuevoEstudiante = this.estudianteRepo.create(data);
    return this.estudianteRepo.save(nuevoEstudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepo.findOneBy({ id });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return estudiante;
  }
  async inscribirseActividad(
    estudianteID: number,
    actividadID: number,
  ): Promise<string> {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id: estudianteID },
    });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const actividad = await this.actividadRepo.findOne({
      where: { id: actividadID },
      relations: ['inscritos'],
    });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    if (actividad.estado !== 0) {
      throw new BadRequestException('La actividad no está abierta');
    }

    const inscritosActuales = actividad.inscritos.length || 0;
    if (inscritosActuales >= actividad.cupoMax) {
      throw new BadRequestException('No hay cupo disponible');
    }

    const yaInscrito = actividad.inscritos.some(
      (inscrito) => inscrito.id === estudianteID,
    );
    if (yaInscrito) {
      throw new BadRequestException('Ya estás inscrito en esta actividad');
    }

    actividad.inscritos.push(estudiante);
    await this.actividadRepo.save(actividad);

    return 'Inscripción realizada exitosamente';
  }
}
