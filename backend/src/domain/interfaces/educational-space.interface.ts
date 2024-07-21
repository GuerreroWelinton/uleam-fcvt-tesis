import { BASE_RECORD_STATES, DAY_OF_WEEK } from "../../constants/constants";

export interface IEducationalSpace {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  hoursOfOperation: IHoursOfOperation[];
  buildingId: string;
  userId: string[];
  status?: BASE_RECORD_STATES;
}

export interface IHoursOfOperation {
  dayOfWeek: (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];
  startTime: string;
  endTime: string;
}
