import {
  IdBaseDto,
  ListFileUploadDto,
  RegisterEducationalSpaceDto,
  UpdateEducationalSpaceDto,
} from "../dtos";
import { EducationalSpaceEntity, FileUploadEntity } from "../entities";

export abstract class EducationalSpaceDataSource {
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

  abstract uploadPdf(
    educationalSpaceId: IdBaseDto,
    file: Express.Multer.File
  ): Promise<FileUploadEntity>;

  abstract listPdf(listFileUploadDto: ListFileUploadDto): Promise<{
    files: FileUploadEntity[];
    total: number;
  }>;
}
