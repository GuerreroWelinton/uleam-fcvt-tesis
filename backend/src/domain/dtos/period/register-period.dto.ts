import { BASE_RECORD_STATES } from "../../../constants/constants";

export class RegisterPeriodDto {
  constructor(public code: string, public status: BASE_RECORD_STATES) {
    this.status = status || BASE_RECORD_STATES.ACTIVE;
  }

  static create(object: { [key: string]: any }): [string?, RegisterPeriodDto?] {
    const { code, status } = object;

    if (!code) {
      return ["El código es requerido"];
    }
    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [undefined, new RegisterPeriodDto(code, status)];
  }
}
