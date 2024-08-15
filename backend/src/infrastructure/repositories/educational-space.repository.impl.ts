import { EducationalSpaceDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  ListFileUploadDto,
  RegisterEducationalSpaceDto,
  UpdateEducationalSpaceDto,
} from "../../domain/dtos";
import {
  EducationalSpaceEntity,
  FileUploadEntity,
} from "../../domain/entities";
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

  uploadPdf(
    educationalSpaceId: IdBaseDto,
    file: Express.Multer.File
  ): Promise<FileUploadEntity> {
    return this.educationalSpaceDataSource.uploadPdf(educationalSpaceId, file);
  }

  listPdf(
    listFileUploadDto: ListFileUploadDto
  ): Promise<{ files: FileUploadEntity[]; total: number }> {
    return this.educationalSpaceDataSource.listPdf(listFileUploadDto);
  }
}
