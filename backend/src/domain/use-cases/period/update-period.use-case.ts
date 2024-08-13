import { IdBaseDto, UpdatePeriodDto } from "../../dtos";
import { IApiResponse, IPeriod } from "../../interfaces";
import { PeriodRepository } from "../../repositories";

interface UpdatePeriodUseCase {
  execute(
    periodId: IdBaseDto,
    updatePeriodDto: UpdatePeriodDto
  ): Promise<Partial<IApiResponse<IPeriod>>>;
}

export class UpdatePeriod implements UpdatePeriodUseCase {
  constructor(private readonly periodRepository: PeriodRepository) {}

  async execute(
    periodId: IdBaseDto,
    updatePeriodDto: UpdatePeriodDto
  ): Promise<Partial<IApiResponse<IPeriod>>> {
    await this.periodRepository.update(periodId, updatePeriodDto);
    return {
      message: `El período se ha actualizado con éxito`,
    };
  }
}
