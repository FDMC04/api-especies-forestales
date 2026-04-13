import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GenereService } from './genere.service';
import { CreateGenereDto } from './dto/create-genere.dto';
import { UpdateGenereDto } from './dto/update-genere.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('genere')
export class GenereController {
  constructor(private readonly genereService: GenereService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createGenereDto: CreateGenereDto) {
    return this.genereService.create(createGenereDto);
  }

  @Get()
  findAll() {
    return this.genereService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genereService.findOne(id);
  }

  @Get('search/:term')
  findAllBy(@Param('term') term: string) {
    return this.genereService.findAllBy(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenereDto: UpdateGenereDto,
  ) {
    return this.genereService.update(id, updateGenereDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.genereService.remove(id);
  }
}
