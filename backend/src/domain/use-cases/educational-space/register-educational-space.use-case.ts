import { RegisterEducationalSpaceDto } from "../../dtos";
import { IApiResponse, IEducationalSpace } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface RegisterEducationalSpaceUseCase {
  execute(
    registerEducationalSpaceDto: RegisterEducationalSpaceDto
  ): Promise<Partial<IApiResponse<IEducationalSpace>>>;
}

export class RegisterEducationalSpace
  implements RegisterEducationalSpaceUseCase
{
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  async execute(
    registerEducationalSpaceDto: RegisterEducationalSpaceDto
  ): Promise<Partial<IApiResponse<IEducationalSpace>>> {
    const { code } = await this.educationalSpaceRepository.register(
      registerEducationalSpaceDto
    );

    return {
      message: `Espacio educativo con el código ${code} se ha registrado con éxito`,
    };
  }
}
