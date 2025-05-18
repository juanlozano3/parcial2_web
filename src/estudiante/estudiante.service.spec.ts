import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from '../actividad/entities/actividad.entity';
import { Estudiante } from './entities/estudiante.entity';
import { EstudianteService } from './estudiante.service';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepo: Repository<Estudiante>;
  let actividadRepo: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
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

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepo = module.get(getRepositoryToken(Estudiante));
    actividadRepo = module.get(getRepositoryToken(Actividad));
  });

  it('crear estudiante', async () => {
    const data = {
      cedula: 123,
      nombre: 'Juan',
      correo: 'Juan@gmail.com',
      programa: 'Ingeniería',
      semestre: 8,
    };
    jest.spyOn(estudianteRepo, 'create').mockReturnValue(data as Estudiante);
    jest.spyOn(estudianteRepo, 'save').mockResolvedValue(data as Estudiante);

    const result = await service.crearEstudiante(data);
    expect(result).toEqual(data);
  });

  it('crear estudiante mal', async () => {
    const data = {
      cedula: 123,
      nombre: 'Juan',
      correo: 'juan@com.',
      programa: 'Ingeniería',
      semestre: 8,
    };
    await expect(service.crearEstudiante(data)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Encontrar id', async () => {
    const estudiante: Partial<Estudiante> = { id: 1 };

    jest
      .spyOn(estudianteRepo, 'findOneBy')
      .mockResolvedValue(estudiante as Estudiante);

    const result = await service.findEstudianteById(1);
    expect(result).toEqual(estudiante);
  });
  it('inscribe bien si hay cupo y la actividad está abierta', async () => {
    const estudianteId = 1;
    const actividadId = 1;

    const estudiante = {
      id: estudianteId,
      nombre: 'Juan Lozano',
      correo: 'juan@gmail.com',
      programa: 'Ingeniería',
      semestre: 8,
    } as Estudiante;

    const actividad = {
      id: actividadId,
      titulo: 'Partido Santa Fe',
      fecha: '2024-05-17',
      cupoMax: 30,
      estado: 0,
      inscritos: [],
      resenias: [],
    } as Actividad;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(actividad);
    jest
      .spyOn(actividadRepo, 'save')
      .mockImplementation((act: Actividad) => Promise.resolve(act));

    const result = await service.inscribirseActividad(
      estudianteId,
      actividadId,
    );
    expect(result).toBe('Inscripción realizada exitosamente');
  });
  it('lanza error si el estudiante no existe', async () => {
    const estudianteId = 100;
    const actividadId = 1;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(null);

    await expect(
      service.inscribirseActividad(estudianteId, actividadId),
    ).rejects.toThrow('Estudiante no encontrado');
  });
  it('lanza error si la actividad no existe', async () => {
    const estudianteId = 1;
    const actividadId = 100;

    const estudiante = { id: estudianteId } as Estudiante;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(null);

    await expect(
      service.inscribirseActividad(estudianteId, actividadId),
    ).rejects.toThrow('Actividad no encontrada');
  });

  it('si la actividad no está abierta', async () => {
    const estudianteId = 1;
    const actividadId = 1;

    const estudiante = { id: estudianteId } as Estudiante;
    const actividad = {
      id: actividadId,
      estado: 1,
      cupoMax: 10,
      inscritos: [],
      titulo: '',
      fecha: '',
      resenias: [],
    } as Actividad;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(actividad);

    await expect(
      service.inscribirseActividad(estudianteId, actividadId),
    ).rejects.toThrow('La actividad no está abierta');
  });
});
