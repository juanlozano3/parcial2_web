import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseniaModule } from './resenia/resenia.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'juanl',
      password: '',
      database: 'parcial2_web',
      synchronize: true,
      autoLoadEntities: true,
    }),
    EstudianteModule,
    ActividadModule,
    ReseniaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
