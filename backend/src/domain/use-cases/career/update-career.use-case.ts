import { IdBaseDto, UpdateCareerDto } from "../../dtos";
import { IApiResponse, ICareer } from "../../interfaces";
import { CareerRepository } from "../../repositories";

interface UpdateCareerUseCase {
  execute(
    careerId: IdBaseDto,
    updateCareerDto: UpdateCareerDto
  ): Promise<Partial<IApiResponse<ICareer>>>;
}

export class UpdateCareer implements UpdateCareerUseCase {
  constructor(private readonly careerRepository: CareerRepository) {}

  async execute(
    careerId: IdBaseDto,
    updateCareerDto: UpdateCareerDto
  ): Promise<Partial<IApiResponse<ICareer>>> {
    const career = await this.careerRepository.update(
      careerId,
      updateCareerDto
    );

    return {
      message: "Carrera se ha actualizada con éxito",
    };
  }
}
