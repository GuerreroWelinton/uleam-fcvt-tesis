import { IApiResponse, IPeriod } from "../../interfaces";
import { PeriodRepository } from "../../repositories";

interface ListPeriodUseCase {
  execute(): Promise<Partial<IApiResponse<IPeriod[]>>>;
}

export class ListPeriod implements ListPeriodUseCase {
  constructor(private readonly periodRepository: PeriodRepository) {}

  async execute(): Promise<Partial<IApiResponse<IPeriod[]>>> {
    const periods = await this.periodRepository.list();

    return {
      message: "Periodos encontrados con éxito",
      data: {
        result: periods.map((period) => {
          const { id, code, status, createdAt, updatedAt } = period;
          return {
            id,
            code,
            status,
            createdAt,
            updatedAt,
          };
        }),
      },
    };
  }
}
