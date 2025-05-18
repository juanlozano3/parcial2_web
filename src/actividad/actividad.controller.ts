import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { Actividad } from './entities/actividad.entity';

@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  crear(@Body() data: Partial<Actividad>) {
    return this.actividadService.crearActividad(data);
  }

  @Patch(':id/estado')
  cambiarEstado(@Param('id') id: number, @Body('estado') estado: number) {
    return this.actividadService.cambiarEstado(id, estado);
  }

  @Get('fecha/:fecha')
  getByFecha(@Param('fecha') fecha: string) {
    return this.actividadService.findAllActividadesByDate(fecha);
  }
}
