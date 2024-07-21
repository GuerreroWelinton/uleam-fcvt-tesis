import { IdBaseDto, RegisterPeriodDto, UpdatePeriodDto } from "../dtos";
import { PeriodEntity } from "../entities";

export abstract class PeriodRepository {
  abstract list(): Promise<PeriodEntity[]>;

  //findById
  //findOneByCode

  abstract register(
    registerPeriodDto: RegisterPeriodDto
  ): Promise<PeriodEntity>;

  abstract delete(periodId: IdBaseDto): Promise<PeriodEntity>;

  abstract update(
    periodId: IdBaseDto,
    updatePeriodDto: UpdatePeriodDto
  ): Promise<PeriodEntity>;
}
