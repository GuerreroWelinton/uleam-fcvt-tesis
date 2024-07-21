import { BASE_RECORD_STATES } from "../../../constants/constants";

export class UpdateCareerDto {
  private constructor(
    public name?: string,
    public code?: string,
    public numberOfLevels?: number,
    public description?: string,
    public status?: BASE_RECORD_STATES
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateCareerDto?] {
    const { name, code, numberOfLevels, description, status } = object;

    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new UpdateCareerDto(name, code, numberOfLevels, description, status),
    ];
  }
}
