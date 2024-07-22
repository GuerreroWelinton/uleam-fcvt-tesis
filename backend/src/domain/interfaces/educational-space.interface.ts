import { BASE_RECORD_STATES, DAY_OF_WEEK } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";
import { IBuilding } from "./building.interface";
import { IUser } from "./user.interface";

export interface IEducationalSpace extends IBaseRecord {
  name: string;
  code: string;
  floor: number;
  capacity: number;
  hoursOfOperation: IHoursOfOperation[];
  building: IBuilding;
  users: IUser[];
  status: BASE_RECORD_STATES;
}

export interface IHoursOfOperation {
  dayOfWeek: (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];
  startTime: string;
  endTime: string;
}
