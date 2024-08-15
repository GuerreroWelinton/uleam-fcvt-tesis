import { IdBaseDto } from "../../dtos";
import { IApiResponse, IEducationalSpace, IFileUpload } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface UploadPdfEducationalSpaceUseCase {
  execute(
    educationalSpaceId: IdBaseDto,
    file: Express.Multer.File
  ): Promise<Partial<IApiResponse<IFileUpload>>>;
}

export class UploadPdfEducationalSpace
  implements UploadPdfEducationalSpaceUseCase
{
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  async execute(
    educationalSpaceId: IdBaseDto,
    file: Express.Multer.File
  ): Promise<Partial<IApiResponse<IFileUpload>>> {
    const { originalName } = await this.educationalSpaceRepository.uploadPdf(
      educationalSpaceId,
      file
    );

    return {
      message: `El archivo ${originalName} se ha subido con éxito`,
    };
  }
}
