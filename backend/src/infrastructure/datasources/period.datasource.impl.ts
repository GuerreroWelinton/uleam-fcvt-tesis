import { BASE_RECORD_STATES } from "../../constants/constants";
import { PeriodModel } from "../../data/mongodb";
import { PeriodDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  RegisterPeriodDto,
  UpdatePeriodDto,
} from "../../domain/dtos";
import { PeriodEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { PeriodMapper } from "../mappers";

export class PeriodDataSourceImpl implements PeriodDataSource {
  constructor() {}

  async list(): Promise<PeriodEntity[]> {
    return handleTryCatch<PeriodEntity[]>(async () => {
      const periods = await PeriodModel.find({
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .sort({ createdAt: -1 })
        .exec();

      return periods.map((period) => {
        return PeriodMapper.periodEntityFromObject(period);
      });
    });
  }

  //findById
  //findOneByCode

  async register(registerPeriodDto: RegisterPeriodDto): Promise<PeriodEntity> {
    return handleTryCatch<PeriodEntity>(async () => {
      const { code, status } = registerPeriodDto;

      const existingPeriod = await PeriodModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingPeriod) {
        throw CustomError.conflict("Ya existe un periodo con el mismo código");
      }

      const period = await PeriodModel.create({
        code,
        status,
      });
      await period.save();

      return PeriodMapper.periodEntityFromObject(period);
    });
  }

  async delete(periodId: IdBaseDto): Promise<PeriodEntity> {
    return handleTryCatch<PeriodEntity>(async () => {
      const { id } = periodId;
      const deletedPeriod = await PeriodModel.findOneAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { status: BASE_RECORD_STATES.DELETED },
        { new: true }
      ).exec();

      if (!deletedPeriod) {
        throw CustomError.notFound("El periodo que desea eliminar no existe");
      }

      return PeriodMapper.periodEntityFromObject(deletedPeriod);
    });
  }

  async update(
    periodId: IdBaseDto,
    updatePeriodDto: UpdatePeriodDto
  ): Promise<PeriodEntity> {
    if (Object.values(updatePeriodDto).every((value) => value === undefined)) {
      throw CustomError.badRequest(
        "Debe enviar al menos un dato para actualizar el periodo"
      );
    }

    const { id } = periodId;
    const { code, status } = updatePeriodDto;

    const existingPeriod = await PeriodModel.findOne({
      code,
      status: { $ne: BASE_RECORD_STATES.DELETED },
    }).exec();

    if (existingPeriod) {
      throw CustomError.conflict("Ya existe un periodo con el mismo código");
    }

    const updatedPeriod = await PeriodModel.findOneAndUpdate(
      { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
      { code, status },
      { new: true }
    ).exec();

    if (!updatedPeriod) {
      throw CustomError.notFound("El periodo que desea actualizar no existe");
    }

    return PeriodMapper.periodEntityFromObject(updatedPeriod);
  }
}
