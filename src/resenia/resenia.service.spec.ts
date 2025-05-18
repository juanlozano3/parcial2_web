import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from '../actividad/entities/actividad.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Resenia } from './entities/resenia.entity';
import { ReseniaService } from './resenia.service';

describe('ReseniaService', () => {
  let service: ReseniaService;
  let reseniaRepo: Repository<Resenia>;
  let estudianteRepo: Repository<Estudiante>;
  let actividadRepo: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReseniaService,
        {
          provide: getRepositoryToken(Resenia),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Estudiante),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Actividad),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    reseniaRepo = module.get(getRepositoryToken(Resenia));
    estudianteRepo = module.get(getRepositoryToken(Estudiante));
    actividadRepo = module.get(getRepositoryToken(Actividad));
  });

  it('agrega reseña válida', async () => {
    const estudiante = { id: 1 } as Estudiante;
    const actividad = {
      id: 1,
      estado: 2,
      inscritos: [estudiante],
    } as Actividad;
    const data = {
      comentario: 'Excelente',
      calificacion: 5,
      fecha: '2024-05-17',
    };

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(actividad);
    jest
      .spyOn(reseniaRepo, 'create')
      .mockReturnValue({ ...data, estudiante, actividad } as Resenia);
    jest
      .spyOn(reseniaRepo, 'save')
      .mockResolvedValue({ ...data, estudiante, actividad } as Resenia);

    const result = await service.agregarReseña(
      estudiante.id,
      actividad.id,
      data,
    );
    expect(result).toEqual('Reseña agregada exitosamente');
  });

  it('falla si actividad no ha finalizado', async () => {
    const estudiante = { id: 1 } as Estudiante;
    const actividad = {
      id: 1,
      estado: 0,
      inscritos: [estudiante],
    } as Actividad;
    const data = { comentario: 'Buena', calificacion: 4, fecha: '2024-05-17' };

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(actividad);

    await expect(
      service.agregarReseña(estudiante.id, actividad.id, data),
    ).rejects.toThrow(BadRequestException);
  });
});
