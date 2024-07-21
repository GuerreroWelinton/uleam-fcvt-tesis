import { BASE_RECORD_STATES } from "../../constants/constants";

export class CareerEntity {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public numberOfLevels: number,
    public description: string,
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
