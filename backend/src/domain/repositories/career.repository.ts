import {
  CodeBaseDto,
  IdBaseDto,
  RegisterCareerDto,
  UpdateCareerDto,
} from "../dtos";
import { CareerEntity } from "../entities";

export abstract class CareerRepository {
  abstract list(): Promise<CareerEntity[]>;

  abstract findById(careerId: IdBaseDto): Promise<CareerEntity>;

  abstract findOneByCode(careerCode: CodeBaseDto): Promise<CareerEntity>;

  abstract register(
    registerCareerDto: RegisterCareerDto
  ): Promise<CareerEntity>;

  abstract delete(careerId: IdBaseDto): Promise<CareerEntity>;

  abstract update(
    careerId: IdBaseDto,
    updateCareerDto: UpdateCareerDto
  ): Promise<CareerEntity>;
}
