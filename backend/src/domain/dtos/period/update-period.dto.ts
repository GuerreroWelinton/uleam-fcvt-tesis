import { BASE_RECORD_STATES } from "../../../constants/constants";

export class UpdatePeriodDto {
  constructor(
    public code?: string,
    public startDate?: Date,
    public endDate?: Date,
    public status?: BASE_RECORD_STATES
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdatePeriodDto?] {
    const { code, startDate, endDate, status } = object;

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

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

    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido."];
    }

    return [
      undefined,
      new UpdatePeriodDto(code, parsedStartDate, parsedEndDate, status),
    ];
  }
}
