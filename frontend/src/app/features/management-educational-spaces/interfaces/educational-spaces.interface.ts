import {
  BASE_RECORD_STATES,
  DAY_OF_WEEK,
} from '../../../core/enums/general.enum';
import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/component.interface';
import { IBuilding } from '../../buildings/interfaces/building.interface';
import { IUser } from '../../users/interfaces/user.interface';

export interface IEducationalSpace extends IBaseRecord {
  name: string;
  code: string;
  floor: number;
  capacity: number;
  // hoursOfOperation: IHoursOfOperation[];
  building: IBuilding;
  users: IUser[];
  status: BASE_RECORD_STATES;
}

export interface IHoursOfOperation {
  dayOfWeek: (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];
  startTime: string;
  endTime: string;
}

export interface IEducationalSpaceTable extends IEducationalSpace {
  actions: ITableAction[];
}
