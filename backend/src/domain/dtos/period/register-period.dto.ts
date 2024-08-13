import { BASE_RECORD_STATES } from "../../../constants/constants";

export class RegisterPeriodDto {
  constructor(
    public code: string,
    public startDate: Date,
    public endDate: Date,
    public status?: BASE_RECORD_STATES
  ) {
    this.status = status || BASE_RECORD_STATES.ACTIVE;
  }

  static create(object: { [key: string]: any }): [string?, RegisterPeriodDto?] {
    let { code, startDate, endDate, status } = object;

    if (!code) {
      return ["El código es requerido"];
    }

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (!startDate) {
      return ["La fecha de inicio es requerida"];
    }
    parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      return ["La fecha de inicio no es válida"];
    }

    if (!endDate) {
      return ["La fecha de fin es requerida"];
    }
    parsedEndDate = new Date(endDate);
    if (isNaN(parsedEndDate.getTime())) {
      return ["La fecha de fin no es válida"];
    }

    if (parsedStartDate >= parsedEndDate) {
      return ["La fecha de inicio debe ser menor a la fecha de fin"];
    }

    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [undefined, new RegisterPeriodDto(code, startDate, endDate, status)];
  }
}
