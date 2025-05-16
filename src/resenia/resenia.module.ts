import { Module } from '@nestjs/common';
import { ReseniaService } from './resenia.service';
import { ReseniaController } from './resenia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resenia } from './entities/resenia.entity';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resenia, Action, Estudiante])],
  controllers: [ReseniaController],
  providers: [ReseniaService],
})
export class ReseniaModule {}
