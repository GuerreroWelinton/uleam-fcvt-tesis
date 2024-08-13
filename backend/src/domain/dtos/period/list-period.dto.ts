import { Validators } from "../../../config";
import { BASE_RECORD_STATES } from "../../../constants/constants";

export class ListPeriodDto {
  constructor(
    public limit?: string,
    public page?: string,
    public id?: string,
    public code?: string,
    public startDate?: Date,
    public endDate?: Date,
    public status?: BASE_RECORD_STATES,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, ListPeriodDto?] {
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
    } = object;

    if (id && !Validators.id.test(id)) {
      return ["El id no es válido."];
    }

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;
    let parsedCreatedAt: Date | undefined;
    let parsedUpdatedAt: Date | undefined;

    if (startDate) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return ["La fecha de inicio no es válida"];
      }
    }

    if (endDate) {
      parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        return ["La fecha de fin no es válida"];
      }
    }

    if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
      return ["La fecha de inicio debe ser menor a la fecha de fin"];
    }

    let statusArray: BASE_RECORD_STATES[] = [];
    if (status) {
      if (Array.isArray(status)) {
        statusArray = status;
      } else {
        statusArray = [status];
      }
      for (const s of statusArray) {
        if (!Object.values(BASE_RECORD_STATES).includes(s)) {
          return ["Uno de los estados no es válido"];
        }
      }
    }

    if (createdAt) {
      parsedCreatedAt = new Date(createdAt);
      if (isNaN(parsedCreatedAt.getTime())) {
        return ["La fecha de creación no es válida"];
      }
    }

    if (updatedAt) {
      parsedUpdatedAt = new Date(updatedAt);
      if (isNaN(parsedUpdatedAt.getTime())) {
        return ["La fecha de actualización no es válida"];
      }
    }

    return [
      undefined,
      new ListPeriodDto(
        limit,
        page,
        id,
        code,
        parsedStartDate,
        parsedEndDate,
        status,
        parsedCreatedAt,
        parsedUpdatedAt
      ),
    ];
  }
}
