import { BASE_RECORD_STATES } from "../../../constants/constants";

export class UpdateBuildingDto {
  private constructor(
    public name?: string,
    public code?: string,
    public address?: string,
    public numberOfFloors?: number,
    public status?: BASE_RECORD_STATES
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateBuildingDto?] {
    const { name, code, address, numberOfFloors, status } = object;

    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new UpdateBuildingDto(name, code, address, numberOfFloors, status),
    ];
  }
}
