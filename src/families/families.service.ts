import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Family } from './entities/family.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateFamilyDto } from './dto/create-family.dto';
import { validate as isUUID } from 'uuid';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Regions } from 'src/regions/entities';

@Injectable()
export class FamiliesService {
  private readonly logger = new Logger('FamiliesService');

  constructor(
    @InjectRepository(Family)
    private readonly familiesRepository: Repository<Family>,

    @InjectRepository(Regions)
    private readonly regionRepository: Repository<Regions>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createFamilyDto: CreateFamilyDto) {
    try {
      const { regions = [], ...familyData } = createFamilyDto;

      const family = this.familiesRepository.create({
        ...familyData,
        regions: regions.map((id) => ({ id })),
      });
      await this.familiesRepository.save(family);
      return family;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll() {
    const families = await this.familiesRepository.find();
    return families;
  }

  async findOne(id: string) {
    let family: Family | null;
    if (isUUID(id)) {
      family = await this.familiesRepository.findOneBy({ id: id });
    } else {
      throw new BadRequestException(`Incorrect Id`);
    }
    if (!family) throw new NotFoundException(`Family with id: ${id} not found`);
    return family;
  }

  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    const { regions, ...familyData } = updateFamilyDto;
    const family = await this.familiesRepository.preload({
      id,
      ...familyData,
      regions: regions!.map((id) => ({ id })),
    });

    if (!family) throw new NotFoundException(`Family with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(family);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const family = await this.findOne(id);
    await this.familiesRepository.remove(family);
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
