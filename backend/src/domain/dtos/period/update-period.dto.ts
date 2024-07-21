import { BASE_RECORD_STATES } from "../../../constants/constants";

export class UpdatePeriodDto {
  constructor(public code?: string, public status?: BASE_RECORD_STATES) {}

  static create(object: { [key: string]: any }): [string?, UpdatePeriodDto?] {
    const { code, status } = object;

    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido."];
    }

    return [undefined, new UpdatePeriodDto(code, status)];
  }
}
