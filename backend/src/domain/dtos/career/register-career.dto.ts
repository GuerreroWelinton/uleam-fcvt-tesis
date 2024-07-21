import { BASE_RECORD_STATES } from "../../../constants/constants";

export class RegisterCareerDto {
  private constructor(
    public name: string,
    public code: string,
    public numberOfLevels: number,
    public description: string,
    public status?: BASE_RECORD_STATES
  ) {
    this.status = status || BASE_RECORD_STATES.ACTIVE;
  }

  static create(object: { [key: string]: any }): [string?, RegisterCareerDto?] {
    const { name, code, numberOfLevels, description, status } = object;

    if (!name) {
      return ["El nombre es requerido"];
    }
    if (!code) {
      return ["El código es requerido"];
    }
    if (!numberOfLevels) {
      return ["El número de niveles es requerido"];
    }
    if (!description) {
      return ["La descripción es requerida"];
    }
    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new RegisterCareerDto(name, code, numberOfLevels, description, status),
    ];
  }
}
