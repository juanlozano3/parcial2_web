import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Actividad } from './entities/actividad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async crearActividad(data: Partial<Actividad>): Promise<Actividad> {
    const { titulo } = data;
    if (titulo === undefined) {
      throw new BadRequestException('Datos incompletos');
    }
    if (titulo.length < 15) {
      throw new BadRequestException('No cumple los requisitos');
    }
    const valido = /^[a-zA-Z0-9\s]+$/;
    if (!valido.test(titulo)) {
      throw new BadRequestException('El título no puede contener símbolos');
    }
    const nuevoActividad = this.actividadRepo.create(data);
    return this.actividadRepo.save(nuevoActividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    if (!fecha) {
      throw new BadRequestException('La fecha es obligatoria');
    }

    const actividades = await this.actividadRepo.find({
      where: { fecha },
    });

    return actividades;
  }
  async cambiarEstado(
    actividadID: number,
    nuevoEstado: number,
  ): Promise<string> {
    const actividad = await this.actividadRepo.findOne({
      where: { id: actividadID },
      relations: ['inscritos'],
    });

    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    const totalInscritos = actividad.inscritos.length;
    const cupo = actividad.cupoMax;

    if (nuevoEstado === 1) {
      const porcentaje = (totalInscritos / cupo) * 100;
      if (porcentaje < 80) {
        throw new BadRequestException(' menos del 80% del cupo ');
      }
    } else if (nuevoEstado === 2) {
      if (totalInscritos < cupo) {
        throw new BadRequestException('aún hay cupo disponible');
      }
    } else if (nuevoEstado !== 0) {
      throw new BadRequestException('Estado no válido');
    }

    actividad.estado = nuevoEstado;
    await this.actividadRepo.save(actividad);

    return `Estado cambiado exitosamente a ${nuevoEstado}`;
  }
}
