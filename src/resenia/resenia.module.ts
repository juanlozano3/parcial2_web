import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { ReseniaController } from './resenia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resenia } from './entities/resenia.entity';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { ActividadModule } from 'src/actividad/actividad.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resenia, Action, Estudiante]),
    ActividadModule,
  ],
  controllers: [ReseniaController],
  providers: [ReseniaService],
  exports: [TypeOrmModule],
})
export class ReseniaModule {}
