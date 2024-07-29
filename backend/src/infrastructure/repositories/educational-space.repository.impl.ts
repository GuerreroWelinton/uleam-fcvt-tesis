import { EducationalSpaceDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  RegisterEducationalSpaceDto,
  UpdateEducationalSpaceDto,
} from "../../domain/dtos";
import { EducationalSpaceEntity } from "../../domain/entities";
import { EducationalSpaceRepository } from "../../domain/repositories";

export class EducationalSpaceRepositoryImpl
  implements EducationalSpaceRepository
{
  constructor(
    private readonly educationalSpaceDataSource: EducationalSpaceDataSource
  ) {}

  list(): Promise<EducationalSpaceEntity[]> {
    return this.educationalSpaceDataSource.list();
  }

  register(
    registerEducationalSpaceDto: RegisterEducationalSpaceDto
  ): Promise<EducationalSpaceEntity> {
    return this.educationalSpaceDataSource.register(
      registerEducationalSpaceDto
    );
  }

  delete(educationalSpaceId: IdBaseDto): Promise<EducationalSpaceEntity> {
    return this.educationalSpaceDataSource.delete(educationalSpaceId);
  }

  update(
    educationalSpaceId: IdBaseDto,
    updateEducationalSpaceDto: UpdateEducationalSpaceDto
  ): Promise<EducationalSpaceEntity> {
    return this.educationalSpaceDataSource.update(
      educationalSpaceId,
      updateEducationalSpaceDto
    );
  }

  listByUserId(userId: IdBaseDto): Promise<EducationalSpaceEntity[]> {
    return this.educationalSpaceDataSource.listByUserId(userId);
  }
}
