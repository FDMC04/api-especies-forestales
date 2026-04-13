import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { RegionImage, Regions } from './entities';
import { isUUID } from 'class-validator';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Family } from 'src/families/entities/family.entity';

@Injectable()
export class RegionsService {
  private readonly logger = new Logger('RegionsService');

  constructor(
    @InjectRepository(Regions)
    private readonly regionsRepository: Repository<Regions>,

    @InjectRepository(RegionImage)
    private readonly regionImageRepository: Repository<RegionImage>,

    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createRegionDto: CreateRegionDto) {
    try {
      const { images = [], families = [], ...regionsData } = createRegionDto;

      const region = this.regionsRepository.create({
        ...regionsData,
        images: images.map((image) =>
          this.regionImageRepository.create({ url: image }),
        ),
        families: families.map((family) =>
          this.familyRepository.create({ scientific_name: family }),
        ),
      });
      await this.regionsRepository.save(region);
      return { ...region, images: images };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll() {
    const regions = await this.regionsRepository.find({
      relations: { images: true },
    });
    return regions.map(({ images, ...rest }) => ({
      ...rest,
      images: images!.map((img) => img.url),
    }));
  }

  async findOne(id: string) {
    let region: Regions | null;
    if (isUUID(id)) {
      region = await this.regionsRepository.findOneBy({ id: id });
    } else {
      throw new BadRequestException(`Incorrect Id`);
    }
    if (!region)
      throw new NotFoundException(`Region with term: ${id} not found`);
    return region;
  }

  async findAllBy(term: string) {
    if (!term) throw new NotFoundException(`Name is required`);
    const region = await this.regionsRepository.find({
      where: {
        name: ILike(`%${term}%`),
      },
    });

    if (!region.length) {
      throw new NotFoundException(`Region with term: ${term} not found`);
    }

    return region;
  }

  async findOnePlain(term: string) {
    if (isUUID(term)) {
      const { images = [], ...rest } = await this.findOne(term);
      return {
        ...rest,
        images: images.map((image) => image.url),
      };
    }
    const regions = await this.findAllBy(term);
    return regions.map(({ images = [], ...rest }) => ({
      ...rest,
      images: images.map((image) => image.url),
    }));
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    const { images, families, ...toUpdate } = updateRegionDto;
    const region = await this.regionsRepository.preload({
      id,
      ...toUpdate,
    });

    if (!region) throw new NotFoundException(`Region with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(RegionImage, { region: { id } });
        region.images = images.map((images) =>
          this.regionImageRepository.create({ url: images }),
        );
      }
      if (families) {
        await queryRunner.manager.delete(Family, { region: { id } });
        region.families = families.map((families) =>
          this.familyRepository.create({ scientific_name: families }),
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
    const region = await this.findOne(id);
    await this.regionsRepository.remove(region);
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
