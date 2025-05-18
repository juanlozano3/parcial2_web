import { Controller, Post, Param, Body } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { Resenia } from './entities/resenia.entity';

@Controller('resenias')
export class ReseniaController {
  constructor(private readonly reseniaService: ReseniaService) {}

  @Post(':estudianteId/:actividadId')
  agregarResenia(
    @Param('estudianteId') estudianteId: number,
    @Param('actividadId') actividadId: number,
    @Body() data: Partial<Resenia>,
  ) {
    return this.reseniaService.agregarReseña(estudianteId, actividadId, data);
  }
}
