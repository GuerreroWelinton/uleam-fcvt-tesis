import { BASE_RECORD_STATES } from "../../constants/constants";
import { PeriodModel } from "../../data/mongodb";
import { PeriodDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  ListPeriodDto,
  RegisterPeriodDto,
  UpdatePeriodDto,
} from "../../domain/dtos";
import { PeriodEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { PeriodMapper } from "../mappers";

export class PeriodDataSourceImpl implements PeriodDataSource {
  constructor() {}

  async list(
    listPeriodDto: ListPeriodDto
  ): Promise<{ periods: PeriodEntity[]; total: number }> {
    return handleTryCatch<{ periods: PeriodEntity[]; total: number }>(
      async () => {
        const {
          limit,
          page,
          id,
          code,
          startDate,
          endDate,
          status,
          createdAt,
          updatedAt,
        } = listPeriodDto;

        let skip: number = 0;
        let formattedLimit: number = 0;
        if (limit && page) {
          const formattedPage = +page;
          formattedLimit = +limit;
          skip = formattedLimit * (formattedPage - 1);
        }

        const query = {
          ...(id && { _id: id }),
          ...(code && { code }),
          ...(startDate && { startDate: { $gte: startDate } }),
          ...(endDate && { endDate: { $lte: endDate } }),
          ...(status && { status: { $in: status } }),
          ...(createdAt && { createdAt: { $gte: createdAt } }),
          ...(updatedAt && { updatedAt: { $lte: updatedAt } }),
        };

        const periods = await PeriodModel.find(query)
          .limit(formattedLimit)
          .skip(skip)
          .sort({ createdAt: -1 })
          .exec();

        const total = await PeriodModel.countDocuments(query).exec();

        return {
          periods: periods.map((period) =>
            PeriodMapper.periodEntityFromObject(period)
          ),
          total,
        };
      }
    );
  }

  async register(registerPeriodDto: RegisterPeriodDto): Promise<PeriodEntity> {
    return handleTryCatch<PeriodEntity>(async () => {
      const { code, startDate, endDate, status } = registerPeriodDto;

      const query = { code, status: { $ne: BASE_RECORD_STATES.DELETED } };
      const existingPeriod = await PeriodModel.exists(query).exec();
      if (existingPeriod) {
        throw CustomError.conflict("Ya existe un periodo con el mismo código");
      }

      const data = { code, startDate, endDate, status };
      const period = await PeriodModel.create(data);
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
    const { code, startDate, endDate, status } = updatePeriodDto;

    if (code) {
      const query = { code, status: { $ne: BASE_RECORD_STATES.DELETED } };
      const existingPeriod = await PeriodModel.exists(query).exec();
      if (existingPeriod) {
        throw CustomError.conflict("Ya existe un periodo con el mismo código");
      }
    }

    const data = {
      ...(code && { code }),
      ...(startDate && { startDate: { $gte: startDate } }),
      ...(endDate && { endDate: { $lte: endDate } }),
      ...(status && { status }),
    };

    const updatedPeriod = await PeriodModel.findOneAndUpdate(
      { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
      { ...data },
      { new: true }
    ).exec();

    if (!updatedPeriod) {
      throw CustomError.notFound("El periodo que desea actualizar no existe");
    }

    return PeriodMapper.periodEntityFromObject(updatedPeriod);
  }
}
