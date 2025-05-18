import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './entities/estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  crear(@Body() data: Partial<Estudiante>) {
    return this.estudianteService.crearEstudiante(data);
  }

  @Get(':id')
  buscar(@Param('id') id: number) {
    return this.estudianteService.findEstudianteById(id);
  }

  @Post(':id/inscribir/:actividadId')
  inscribirse(
    @Param('id') estudianteId: number,
    @Param('actividadId') actividadId: number,
  ) {
    return this.estudianteService.inscribirseActividad(
      estudianteId,
      actividadId,
    );
  }
}
