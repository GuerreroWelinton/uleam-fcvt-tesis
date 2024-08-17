import { IdBaseDto } from "../../dtos";
import { IApiResponse, IFileUpload } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface DeletePdfEducationalSpaceUseCase {
  execute(fileUploadId: IdBaseDto): Promise<Partial<IApiResponse<IFileUpload>>>;
}

export class DeletePdfEducationalSpace
  implements DeletePdfEducationalSpaceUseCase
{
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  async execute(
    fileUploadId: IdBaseDto
  ): Promise<Partial<IApiResponse<IFileUpload>>> {
    const { originalName } = await this.educationalSpaceRepository.deletePdf(
      fileUploadId
    );
    return {
      message: `El archivo PDF con el nombre ${originalName} se ha eliminado con éxito`,
    };
  }
}
