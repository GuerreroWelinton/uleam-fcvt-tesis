import { RegisterPeriodDto } from "../../dtos";
import { IApiResponse, IPeriod } from "../../interfaces";
import { PeriodRepository } from "../../repositories";

interface RegisterPeriodUseCase {
  execute(
    registerPeriodDto: RegisterPeriodDto
  ): Promise<Partial<IApiResponse<IPeriod>>>;
}

export class RegisterPeriod implements RegisterPeriodUseCase {
  constructor(private readonly periodRepository: PeriodRepository) {}

  async execute(
    registerPeriodDto: RegisterPeriodDto
  ): Promise<Partial<IApiResponse<IPeriod>>> {
    const { code } = await this.periodRepository.register(registerPeriodDto);

    return {
      message: `Periodo con el código ${code} se ha registrado con éxito`,
    };
  }
}
