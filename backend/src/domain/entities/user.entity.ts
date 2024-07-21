import { BASE_RECORD_STATES, USER_ROLES } from "../../constants/constants";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public lastName: string,
    public email: string,
    public password: string,
    public phoneNumber: string,
    public roles: USER_ROLES[],
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
