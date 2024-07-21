import { PeriodDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  RegisterPeriodDto,
  UpdatePeriodDto,
} from "../../domain/dtos";
import { PeriodEntity } from "../../domain/entities";
import { PeriodRepository } from "../../domain/repositories";

export class PeriodRepositoryImpl implements PeriodRepository {
  constructor(private readonly periodDataSource: PeriodDataSource) {}

  list(): Promise<PeriodEntity[]> {
    return this.periodDataSource.list();
  }

  //findById
  //findOneByCode

  register(registerPeriodDto: RegisterPeriodDto): Promise<PeriodEntity> {
    return this.periodDataSource.register(registerPeriodDto);
  }

  delete(periodId: IdBaseDto): Promise<PeriodEntity> {
    return this.periodDataSource.delete(periodId);
  }

  update(
    periodId: IdBaseDto,
    updatePeriodDto: UpdatePeriodDto
  ): Promise<PeriodEntity> {
    return this.periodDataSource.update(periodId, updatePeriodDto);
  }
}
