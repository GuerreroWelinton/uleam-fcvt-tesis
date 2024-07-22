import { BASE_RECORD_STATES } from "../../constants/constants";
import { IHoursOfOperation } from "../interfaces";
import { BuildingEntity } from "./building.entity";
import { UserEntity } from "./user.entity";

export class EducationalSpaceEntity {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public floor: number,
    public capacity: number,
    public hoursOfOperation: IHoursOfOperation[],
    public building: BuildingEntity,
    public users: UserEntity[],
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
