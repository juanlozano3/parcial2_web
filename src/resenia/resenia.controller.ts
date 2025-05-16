import { Controller } from '@nestjs/common';
import { ReseniaService } from './resenia.service';

@Controller('resenia')
export class ReseniaController {
  constructor(private readonly reseniaService: ReseniaService) {}
}
