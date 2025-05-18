import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Repository } from 'typeorm';
import { ActividadService } from './actividad.service';
import { Actividad } from './entities/actividad.entity';

describe('ActividadService', () => {
  let service: ActividadService;
  let repo: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        {
          provide: getRepositoryToken(Actividad),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repo = module.get<Repository<Actividad>>(getRepositoryToken(Actividad));
  });

  it('crea una actividad bien', async () => {
    const data = {
      titulo: 'Partido Santa Fe',
      fecha: '2024-05-17',
      cupoMax: 30,
      estado: 0,
    };
    jest.spyOn(repo, 'create').mockReturnValue(data as Actividad);
    jest.spyOn(repo, 'save').mockResolvedValue(data as Actividad);

    const result = await service.crearActividad(data);
    expect(result).toEqual(data);
  });

  it('crear actividad mal', async () => {
    const data = {
      titulo: 'Part',
    };
    await expect(service.crearActividad(data)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('cambia a cerrada cuando el 80% del cupo está lleno', async () => {
    const actividad = {
      id: 1,
      estado: 0,
      cupoMax: 10,
      fecha: '',
      titulo: '',
      resenias: [],
      inscritos: new Array<Estudiante>(8).fill({
        id: 1,
        cedula: 123,
        nombre: 'Juan',
        correo: 'juan@gmail.com',
        programa: 'Ingeniería',
        semestre: 5,
        actividades: [],
        resenias: [],
      }),
    } as Actividad;

    jest.spyOn(repo, 'findOne').mockResolvedValue(actividad);
    jest.spyOn(repo, 'save').mockResolvedValue({
      ...actividad,
      estado: 1,
    });

    const result = await service.cambiarEstado(1, 1);
    expect(result).toBe('Estado cambiado exitosamente a 1');
  });
  it('cambia a finalizada si no hay cupo (estado 2)', async () => {
    const actividad = {
      id: 1,
      estado: 0,
      cupoMax: 2,
      inscritos: Array.from({ length: 2 }, (_, i) => ({
        id: i + 1,
        cedula: 123 + i,
        nombre: 'Estudiante',
        correo: `correo${i}@gmail.com`,
        programa: 'Ing',
        semestre: 3,
        actividades: [],
        resenias: [],
      })) as Estudiante[],

      fecha: '',
      titulo: '',
      resenias: [],
    } as Actividad;

    jest.spyOn(repo, 'findOne').mockResolvedValue(actividad);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...actividad, estado: 2 });

    const result = await service.cambiarEstado(1, 2);
    expect(result).toBe('Estado cambiado exitosamente a 2');
  });
  it('retorna actividades con fecha exacta', async () => {
    const fecha = '2024-05-17';
    const actividades = [
      {
        id: 1,
        titulo: 'Partido',
        fecha,
        estado: 0,
        cupoMax: 30,
        inscritos: [],
        resenias: [],
      },
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(actividades as Actividad[]);

    const result = await service.findAllActividadesByDate(fecha);
    expect(result).toEqual(actividades);
  });

  it('retorna array vacío si no hay actividades para la fecha', async () => {
    const fecha = '2024-12-31';
    jest.spyOn(repo, 'find').mockResolvedValue([]);

    const result = await service.findAllActividadesByDate(fecha);
    expect(result).toEqual([]);
  });
});
