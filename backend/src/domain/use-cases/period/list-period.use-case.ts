import { ListPeriodDto } from "../../dtos";
import { IApiResponse, IPeriod } from "../../interfaces";
import { PeriodRepository } from "../../repositories";

interface ListPeriodUseCase {
  execute(
    listPeriodDto: ListPeriodDto
  ): Promise<Partial<IApiResponse<IPeriod[]>>>;
}

export class ListPeriod implements ListPeriodUseCase {
  constructor(private readonly periodRepository: PeriodRepository) {}

  async execute(
    listPeriodDto: ListPeriodDto
  ): Promise<Partial<IApiResponse<IPeriod[]>>> {
    const { periods, total } = await this.periodRepository.list(listPeriodDto);

    return {
      message: "Periodos encontrados con éxito",
      data: {
        result: periods.map((period) => {
          const { id, code, startDate, endDate, status, createdAt, updatedAt } =
            period;
          return {
            id,
            code,
            startDate,
            endDate,
            status,
            createdAt,
            updatedAt,
          };
        }),
        totalCount: total,
      },
    };
  }
}
