import { EducationalSpaceDataSource } from "../../domain/datasources";
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
}
