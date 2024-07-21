import { BASE_RECORD_STATES } from "../../constants/constants";

export class BuildingEntity {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public address: string,
    public numberOfFloors: number,
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
