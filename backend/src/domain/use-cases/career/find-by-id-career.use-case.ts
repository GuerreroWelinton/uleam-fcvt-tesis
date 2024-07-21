import { IdBaseDto } from "../../dtos";
import { IApiResponse, ICareer } from "../../interfaces";
import { CareerRepository } from "../../repositories";

interface FindByIdCareerUseCase {
  execute(careerId: IdBaseDto): Promise<Partial<IApiResponse<ICareer>>>;
}

export class FindByIdCareer implements FindByIdCareerUseCase {
  constructor(private readonly careerRepository: CareerRepository) {}
  async execute(careerId: IdBaseDto): Promise<Partial<IApiResponse<ICareer>>> {
    const career = await this.careerRepository.findById(careerId);
    const {
      id,
      name,
      code,
      numberOfLevels,
      description,
      status,
      createdAt,
      updatedAt,
    } = career;

    return {
      message: `Carrera encontrada con éxito`,
      data: {
        result: {
          id,
          name,
          code,
          numberOfLevels,
          description,
          status,
          createdAt,
          updatedAt,
        },
      },
    };
  }
}
