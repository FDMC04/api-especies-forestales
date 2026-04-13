import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Species, SpeciesImage } from './entities';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { validate as isUUID } from 'uuid';
import { UpdateSpeciesDto } from './dto/update-species.dto';

@Injectable()
export class SpeciesService {
  private readonly logger = new Logger('SpeciesService');

  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,

    @InjectRepository(SpeciesImage)
    private readonly speciesImageRepository: Repository<SpeciesImage>,

    // @InjectRepository(Family)
    // private readonly familyRepository: Repository<Family>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createSpeciesDto: CreateSpeciesDto) {
    try {
      const { images = [], genere, ...speciesData } = createSpeciesDto;

      const species = this.speciesRepository.create({
        ...speciesData,
        images: images.map((image) =>
          this.speciesImageRepository.create({ url: image }),
        ),
        genere,
      });
      await this.speciesRepository.save(species);
      return { ...species, images: images };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll() {
    const species = await this.speciesRepository.find({
      relations: { images: true },
    });
    return species.map(({ images, ...rest }) => ({
      ...rest,
      images: images!.map((img) => img.url),
    }));
  }

  async findOne(id: string) {
    let species: Species | null;
    if (isUUID(id)) {
      species = await this.speciesRepository.findOneBy({ id: id });
    } else {
      throw new BadRequestException(`Incorrect Id`);
    }
    if (!species)
      throw new NotFoundException(`Species with term: ${id} not found`);
    return species;
  }

  async findAllBy(term: string) {
    if (!term) throw new NotFoundException(`Name is required`);
    const species = await this.speciesRepository.find({
      where: [
        { scientific_name: ILike(`%${term}%`) },
        { common_name: ILike(`%${term}%`) },
      ],
    });

    if (!species.length) {
      throw new NotFoundException(`Species with term: ${term} not found`);
    }

    return species;
  }

  async findOnePlain(term: string) {
    if (isUUID(term)) {
      const { images = [], ...rest } = await this.findOne(term);
      return {
        ...rest,
        images: images.map((image) => image.url),
      };
    }
    const species = await this.findAllBy(term);
    return species.map(({ images = [], ...rest }) => ({
      ...rest,
      images: images.map((image) => image.url),
    }));
  }

  async update(id: string, updateSpeciesDto: UpdateSpeciesDto) {
    const { images, ...toUpdate } = updateSpeciesDto;
    const region = await this.speciesRepository.preload({
      id,
      ...toUpdate,
    });

    if (!region) throw new NotFoundException(`Region with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(SpeciesImage, { region: { id } });
        region.images = images.map((images) =>
          this.speciesImageRepository.create({ url: images }),
        );
      }
      await queryRunner.manager.save(region);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const species = await this.findOne(id);
    await this.speciesRepository.remove(species);
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
