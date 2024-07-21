import { IdBaseDto } from "../../dtos";
import { IApiResponse, IPeriod } from "../../interfaces";
import { PeriodRepository } from "../../repositories";

interface DeletePeriodUseCase {
  execute(periodId: IdBaseDto): Promise<Partial<IApiResponse<IPeriod>>>;
}

export class DeletePeriod implements DeletePeriodUseCase {
  constructor(private readonly periodRepository: PeriodRepository) {}

  async execute(periodId: IdBaseDto): Promise<Partial<IApiResponse<IPeriod>>> {
    const period = await this.periodRepository.delete(periodId);
    const { code } = period;

    return {
      message: `Periodo con el código ${code} se ha eliminado con éxito`,
    };
  }
}
