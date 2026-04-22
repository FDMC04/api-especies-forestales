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
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.create(createFamilyDto);
  }

  @Get()
  findAll() {
    return this.familiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.familiesService.findOne(id);
  }

  @Get('search/:term')
  findAllBy(@Param('term') term: string) {
    return this.familiesService.findAllBy(term);
  }

  @Get('region/:id')
  findAllByRegion(@Param('id', ParseUUIDPipe) id: string) {
    return this.familiesService.findAllByRegion(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ) {
    return this.familiesService.update(id, updateFamilyDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.familiesService.remove(id);
  }
}
