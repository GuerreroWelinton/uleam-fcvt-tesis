import { IdBaseDto } from "../../dtos";
import { IApiResponse, ICareer } from "../../interfaces";
import { CareerRepository } from "../../repositories";

interface DeleteCareerUseCase {
  execute(careerId: IdBaseDto): Promise<Partial<IApiResponse<ICareer>>>;
}

export class DeleteCareer implements DeleteCareerUseCase {
  constructor(private readonly careerRepository: CareerRepository) {}

  async execute(careerId: IdBaseDto): Promise<Partial<IApiResponse<ICareer>>> {
    const career = await this.careerRepository.delete(careerId);
    const { code } = career;

    return {
      message: `Carrera con el código ${code} se ha eliminado con éxito`,
    };
  }
}
