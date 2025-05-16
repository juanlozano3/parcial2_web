import { BadRequestException, Injectable } from '@nestjs/common';
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
}
