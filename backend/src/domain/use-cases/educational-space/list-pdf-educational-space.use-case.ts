import { ListFileUploadDto } from "../../dtos";
import { IApiResponse, IFileUpload } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface ListPdfEducationalSpaceUseCase {
  execute(
    listFileUploadDto: ListFileUploadDto
  ): Promise<Partial<IApiResponse<IFileUpload[]>>>;
}

export class ListPdfEducationalSpace implements ListPdfEducationalSpaceUseCase {
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  async execute(
    listFileUploadDto: ListFileUploadDto
  ): Promise<Partial<IApiResponse<IFileUpload[]>>> {
    const { files, total } = await this.educationalSpaceRepository.listPdf(
      listFileUploadDto
    );

    return {
      message: `Archivos encontrados con éxito`,
      data: {
        result: files.map((pdf) => {
          const {
            id,
            originalName,
            path,
            mimetype,
            size,
            recordId,
            status,
            createdAt,
            updatedAt,
          } = pdf;

          return {
            id,
            originalName,
            path,
            mimetype,
            size,
            recordId,
            status,
            createdAt,
            updatedAt,
          };
        }),
        totalCount: total,
      },
    };
  }
}
