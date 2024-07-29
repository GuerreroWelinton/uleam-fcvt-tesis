import { IdBaseDto, UpdateEducationalSpaceDto } from "../../dtos";
import { IApiResponse, IEducationalSpace } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface UpdateEducationalSpaceUseCase {
  execute(
    educationalSpaceId: IdBaseDto,
    updateEducationalSpaceDto: UpdateEducationalSpaceDto
  ): Promise<Partial<IApiResponse<IEducationalSpace>>>;
}

export class UpdateEducationalSpace implements UpdateEducationalSpaceUseCase {
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  async execute(
    educationalSpaceId: IdBaseDto,
    updateEducationalSpaceDto: UpdateEducationalSpaceDto
  ): Promise<Partial<IApiResponse<IEducationalSpace>>> {
    const { code } = await this.educationalSpaceRepository.update(
      educationalSpaceId,
      updateEducationalSpaceDto
    );

    return {
      message: `El espacio educativo se ha actualizado con éxito`,
    };
  }
}
