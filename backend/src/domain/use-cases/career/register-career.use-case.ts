import { RegisterCareerDto } from "../../dtos";
import { IApiResponse, ICareer } from "../../interfaces";
import { CareerRepository } from "../../repositories";

interface RegisterCareerUseCase {
  execute(
    registerCareerDto: RegisterCareerDto
  ): Promise<Partial<IApiResponse<ICareer>>>;
}

export class RegisterCareer implements RegisterCareerUseCase {
  constructor(private readonly careerRepository: CareerRepository) {}

  async execute(
    registerCareerDto: RegisterCareerDto
  ): Promise<Partial<IApiResponse<ICareer>>> {
    const career = await this.careerRepository.register(registerCareerDto);
    const { code } = career;

    return {
      message: `Carrera con el código ${code} se ha registrado con éxito`,
    };
  }
}
