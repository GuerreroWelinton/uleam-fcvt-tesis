import { BASE_RECORD_STATES } from "../../constants/constants";
import { IHoursOfOperation } from "../interfaces";

export class EducationalSpaceEntity {
  constructor(
    public id: string,
    public name: string,
    public floor: number,
    public capacity: number,
    public hoursOfOperation: IHoursOfOperation[],
    public buildingId: string,
    public userId: string[],
    public status?: BASE_RECORD_STATES
  ) {}
}
