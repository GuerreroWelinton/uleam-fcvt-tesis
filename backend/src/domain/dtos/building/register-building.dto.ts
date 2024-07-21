import { BASE_RECORD_STATES } from "../../../constants/constants";

export class RegisterBuildingDto {
  private constructor(
    public name: string,
    public code: string,
    public address: string,
    public numberOfFloors: number,
    public status?: BASE_RECORD_STATES
  ) {
    this.status = status || BASE_RECORD_STATES.ACTIVE;
  }

  static create(object: {
    [key: string]: any;
  }): [string?, RegisterBuildingDto?] {
    const { name, code, address, numberOfFloors, status } = object;

    if (!name) {
      return ["El nombre es requerido"];
    }
    if (!code) {
      return ["El código es requerido"];
    }
    if (!address) {
      return ["La dirección es requerida"];
    }
    if (!numberOfFloors) {
      return ["El número de pisos es requerido"];
    }
    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new RegisterBuildingDto(name, code, address, numberOfFloors, status),
    ];
  }
}
