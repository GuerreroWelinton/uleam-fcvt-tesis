import { IdBaseDto } from "../../dtos";
import { IApiResponse, IEducationalSpace } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface DeleteEducationalSpaceUseCase {
  execute(
    educationalSpaceId: IdBaseDto
  ): Promise<Partial<IApiResponse<IEducationalSpace>>>;
}

export class DeleteEducationalSpace implements DeleteEducationalSpaceUseCase {
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  async execute(
    educationalSpaceId: IdBaseDto
  ): Promise<Partial<IApiResponse<IEducationalSpace>>> {
    const { code } = await this.educationalSpaceRepository.delete(
      educationalSpaceId
    );
    return {
      message: `El espacio educativo con el código ${code} se ha eliminado con éxito`,
    };
  }
}
