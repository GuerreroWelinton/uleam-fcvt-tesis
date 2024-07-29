import { BASE_RECORD_STATES, DAY_OF_WEEK } from "../../constants/constants";
import { BuildingEntity } from "./building.entity";
import { UserEntity } from "./user.entity";

export class EducationalSpaceEntity {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public floor: number,
    public capacity: number,
    // public hoursOfOperation: HoursOfOperationEntity[],
    public building: BuildingEntity,
    public users: UserEntity[],
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}

export class HoursOfOperationEntity {
  constructor(
    public dayOfWeek: (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK],
    public startTime: string,
    public endTime: string
  ) {}
}
