import { BASE_RECORD_STATES } from "../../../constants/constants";
import { Validators } from "./../../../config/validators";

export class RegisterEducationalSpaceDto {
  private constructor(
    public name: string,
    public code: string,
    public floor: number,
    public capacity: number,
    // public hoursOfOperation: IHoursOfOperation[],
    public buildingId: string,
    public usersId: string[],
    public status: BASE_RECORD_STATES
  ) {
    this.status = status || BASE_RECORD_STATES.ACTIVE;
  }

  static create(object: {
    [key: string]: any;
  }): [string?, RegisterEducationalSpaceDto?] {
    const {
      name,
      code,
      floor,
      capacity,
      // hoursOfOperation,
      buildingId,
      usersId,
      status,
    } = object;

    if (!name) {
      return ["El nombre es requerido"];
    }
    if (!code) {
      return ["El código es requerido"];
    }
    if (!floor) {
      return ["El piso es requerido"];
    }
    if (!capacity) {
      return ["La capacidad es requerida"];
    }
    // if (!hoursOfOperation) {
    //   return ["Las horas de operación son requeridas"];
    // }
    // if (!Array.isArray(hoursOfOperation)) {
    //   return ["Las horas de operación no tienen el formato correcto"];
    // }
    // if (!Validators.isHoursOfOperationArray(hoursOfOperation)) {
    //   return ["Las horas de operación no tienen el formato correcto"];
    // }
    // if (!Validators.isHoursOfOperationValid(hoursOfOperation)) {
    //   return ["Las horas de operación no tienen el formato correcto"];
    // }
    if (!buildingId) {
      return ["El edificio es requerido"];
    }
    if (!Validators.id.test(buildingId)) {
      return ["El edificio no es válido"];
    }
    if (!usersId) {
      return ["El o los usuarios son requeridos"];
    }
    if (!Array.isArray(usersId)) {
      return ["El o los usuarios no tienen el formato correcto"];
    }
    if (!usersId.length) {
      return ["El o los usuarios son requeridos"];
    }
    for (const userId of usersId) {
      if (!Validators.id.test(userId)) {
        return ["El o los usuarios no tienen el formato correcto"];
      }
    }
    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new RegisterEducationalSpaceDto(
        name,
        code,
        floor,
        capacity,
        // hoursOfOperation,
        buildingId,
        usersId,
        status
      ),
    ];
  }
}
