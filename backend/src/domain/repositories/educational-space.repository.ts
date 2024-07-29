import {
  IdBaseDto,
  RegisterEducationalSpaceDto,
  UpdateEducationalSpaceDto,
} from "../dtos";
import { EducationalSpaceEntity } from "../entities";

export abstract class EducationalSpaceRepository {
  abstract list(): Promise<EducationalSpaceEntity[]>;

  abstract register(
    registerEducationalSpaceDto: RegisterEducationalSpaceDto
  ): Promise<EducationalSpaceEntity>;

  abstract delete(
    educationalSpaceId: IdBaseDto
  ): Promise<EducationalSpaceEntity>;

  abstract update(
    educationalSpaceId: IdBaseDto,
    updateEducationalSpaceDto: UpdateEducationalSpaceDto
  ): Promise<EducationalSpaceEntity>;

  abstract listByUserId(userId: IdBaseDto): Promise<EducationalSpaceEntity[]>;
}
