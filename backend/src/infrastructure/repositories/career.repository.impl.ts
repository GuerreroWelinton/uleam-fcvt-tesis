import { CareerDataSource } from "../../domain/datasources";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterCareerDto,
  UpdateCareerDto,
} from "../../domain/dtos";
import { CareerEntity } from "../../domain/entities";
import { CareerRepository } from "../../domain/repositories";

export class CareerRepositoryImpl implements CareerRepository {
  constructor(private readonly careerDataSource: CareerDataSource) {}

  list(): Promise<CareerEntity[]> {
    return this.careerDataSource.list();
  }

  findById(careerId: IdBaseDto): Promise<CareerEntity> {
    return this.careerDataSource.findById(careerId);
  }

  findOneByCode(careerCode: CodeBaseDto): Promise<CareerEntity> {
    return this.careerDataSource.findOneByCode(careerCode);
  }

  register(registerCareerDto: RegisterCareerDto): Promise<CareerEntity> {
    return this.careerDataSource.register(registerCareerDto);
  }

  delete(careerId: IdBaseDto): Promise<CareerEntity> {
    return this.careerDataSource.delete(careerId);
  }

  update(
    careerId: IdBaseDto,
    updateCareerDto: UpdateCareerDto
  ): Promise<CareerEntity> {
    return this.careerDataSource.update(careerId, updateCareerDto);
  }
}
