import { CodeBaseDto } from "../../dtos";
import { IApiResponse, ICareer } from "../../interfaces";
import { CareerRepository } from "../../repositories";

interface FindOneByCodeCareerUseCase {
  execute(careerCode: CodeBaseDto): Promise<Partial<IApiResponse<ICareer>>>;
}

export class FindOneByCodeCareer implements FindOneByCodeCareerUseCase {
  constructor(private readonly careerRepository: CareerRepository) {}

  async execute(
    careerCode: CodeBaseDto
  ): Promise<Partial<IApiResponse<ICareer>>> {
    const career = await this.careerRepository.findOneByCode(careerCode);
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
