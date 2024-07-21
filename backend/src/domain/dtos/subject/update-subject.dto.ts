import { Validators } from "../../../config";
import { BASE_RECORD_STATES } from "../../../constants/constants";

export class UpdateSubjectDto {
  private constructor(
    public name?: string,
    public code?: string,
    public academicLevel?: number,
    public careerId?: string,
    public status?: BASE_RECORD_STATES
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateSubjectDto?] {
    const { name, code, academicLevel, careerId, status } = object;

    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new UpdateSubjectDto(name, code, academicLevel, careerId, status),
    ];
  }
}
