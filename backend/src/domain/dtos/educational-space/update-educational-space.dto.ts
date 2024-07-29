import { BASE_RECORD_STATES } from "../../../constants/constants";

export class UpdateEducationalSpaceDto {
  private constructor(
    public name?: string,
    public code?: string,
    public floor?: number,
    public capacity?: number,
    public buildingId?: string,
    public usersId?: string[],
    public status?: BASE_RECORD_STATES
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdateEducationalSpaceDto?] {
    const { name, code, floor, capacity, buildingId, usersId, status } = object;

    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new UpdateEducationalSpaceDto(
        name,
        code,
        floor,
        capacity,
        buildingId,
        usersId,
        status
      ),
    ];
  }
}
