import {
  IdBaseDto,
  ListPeriodDto,
  RegisterPeriodDto,
  UpdatePeriodDto,
} from "../dtos";
import { PeriodEntity } from "../entities";

export abstract class PeriodDataSource {
  abstract list(
    listPeriodDto: ListPeriodDto
  ): Promise<{ periods: PeriodEntity[]; total: number }>;

  abstract register(
    registerPeriodDto: RegisterPeriodDto
  ): Promise<PeriodEntity>;

  abstract delete(periodId: IdBaseDto): Promise<PeriodEntity>;

  abstract update(
    periodId: IdBaseDto,
    updatePeriodDto: UpdatePeriodDto
  ): Promise<PeriodEntity>;
}
