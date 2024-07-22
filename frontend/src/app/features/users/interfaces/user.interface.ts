import {
  BASE_RECORD_STATES,
  USER_ROLES,
} from '../../../core/enums/general.enum';
import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/component.interface';

export interface IUser extends IBaseRecord {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roles: USER_ROLES[];
  status: BASE_RECORD_STATES;
}

export interface IUserTable extends IUser {
  actions: ITableAction[];
}
