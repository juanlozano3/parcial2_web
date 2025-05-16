import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resenia } from './entities/resenia.entity';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Actividad } from 'src/actividad/entities/actividad.entity';
@Injectable()
export class ReseniaService {
  constructor(
    @InjectRepository(Resenia)
    private reseniaRepo: Repository<Resenia>,
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async agregarReseña(
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

    if (actividad.estado !== 2) {
      throw new BadRequestException('La actividad aún no ha finalizado');
    }

    const estaInscrito = actividad.inscritos.some((e) => e.id === estudianteID);
    if (!estaInscrito) {
      throw new BadRequestException(
        'El estudiante no estuvo inscrito en esta actividad',
      );
    }

    const nuevaReseña = this.reseniaRepo.create({
      estudiante,
      actividad,
    });

    await this.reseniaRepo.save(nuevaReseña);

    return 'Reseña agregada exitosamente';
  }
}
