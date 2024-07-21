import { BASE_RECORD_STATES } from '../enums/common.enum';
import { USER_ROLES } from '../enums/user.enum';

export interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: USER_ROLES[];
  status: BASE_RECORD_STATES;
}
