import { BASE_RECORD_STATES, USER_ROLES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";

export interface IUser extends IBaseRecord {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: USER_ROLES[];
  status: BASE_RECORD_STATES;
}
