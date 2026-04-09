import { Controller } from '@nestjs/common';
import { GenereService } from './genere.service';

@Controller('genere')
export class GenereController {
  constructor(private readonly genereService: GenereService) {}
}
