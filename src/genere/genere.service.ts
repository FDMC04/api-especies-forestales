import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Genere } from './entities/genere.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGenereDto } from './dto/create-genere.dto';
import { validate as isUUID } from 'uuid';
import { UpdateGenereDto } from './dto/update-genere.dto';

@Injectable()
export class GenereService {
  private readonly logger = new Logger('GenereService');

  constructor(
    @InjectRepository(Genere)
    private readonly genereRepository: Repository<Genere>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createGenereDto: CreateGenereDto) {
    try {
      const { family, ...genereData } = createGenereDto;
      const genere = this.genereRepository.create({
        ...genereData,
        family,
      });
      await this.genereRepository.save(genere);
      return genere;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const generes = await this.genereRepository.find();
    return generes;
  }

  async findOne(id: string) {
    let genere: Genere | null;
    if (isUUID(id)) {
      genere = await this.genereRepository.findOneBy({ id: id });
    } else {
      throw new BadRequestException(`Incorrect Id`);
    }
    if (!genere) throw new NotFoundException(`Genere with id: ${id} not found`);
    return genere;
  }

  async findAllBy(term: string) {
    if (!term) throw new NotFoundException(`Name is required`);
    const genere = await this.genereRepository.find({
      where: [
        { scientific_name: ILike(`%${term}%`) },
        { common_name: ILike(`%${term}%`) },
      ],
    });

    if (!genere.length) {
      throw new NotFoundException(`Genere with term: ${term} not found`);
    }
    return genere;
  }

  async update(id: string, updateGenereDto: UpdateGenereDto) {
    const genereData = updateGenereDto;
    const genere = await this.genereRepository.preload({
      id,
      ...genereData,
    });

    if (!genere) throw new NotFoundException(`Genere with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(genere);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const genere = await this.findOne(id);
    await this.genereRepository.remove(genere);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
