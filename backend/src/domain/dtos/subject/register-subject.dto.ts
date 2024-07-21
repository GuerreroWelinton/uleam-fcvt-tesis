import { Validators } from "../../../config";
import { BASE_RECORD_STATES } from "../../../constants/constants";

export class RegisterSubjectDto {
  private constructor(
    public name: string,
    public code: string,
    public academicLevel: number,
    public careerId: string,
    public status?: BASE_RECORD_STATES
  ) {
    this.status = status || BASE_RECORD_STATES.ACTIVE;
  }

  static create(object: {
    [key: string]: any;
  }): [string?, RegisterSubjectDto?] {
    const { name, code, academicLevel, careerId, status } = object;

    if (!name) {
      return ["El nombre es requerido"];
    }
    if (!code) {
      return ["El código es requerido"];
    }
    if (!academicLevel) {
      return ["El nivel académico es requerido"];
    }
    if (!careerId) {
      return ["La carrera es requerida"];
    }
    if (!Validators.id.test(careerId)) {
      return ["La carrera no es válida"];
    }
    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new RegisterSubjectDto(name, code, academicLevel, careerId, status),
    ];
  }
}
