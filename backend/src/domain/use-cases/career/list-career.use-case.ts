import { IApiResponse, ICareer } from "../../interfaces";
import { CareerRepository } from "../../repositories";

interface ListCareerUseCase {
  execute(): Promise<Partial<IApiResponse<ICareer[]>>>;
}

export class ListCareer implements ListCareerUseCase {
  constructor(private readonly careerRepository: CareerRepository) {}
  async execute(): Promise<Partial<IApiResponse<ICareer[]>>> {
    const careers = await this.careerRepository.list();
    return {
      message: `Carreras encontradas con éxito`,
      data: {
        result: careers.map((career) => {
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
            id,
            name,
            code,
            numberOfLevels,
            description,
            status,
            createdAt,
            updatedAt,
          };
        }),
      },
    };
  }
}
