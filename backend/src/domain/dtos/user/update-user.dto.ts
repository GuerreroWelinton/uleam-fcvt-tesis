import { BASE_RECORD_STATES, USER_ROLES } from "../../../constants/constants";

export class UpdateUserDto {
  private constructor(
    public name?: string,
    public lastName?: string,
    public email?: string,
    public identityDocument?: string,
    public phoneNumber?: string,
    public roles?: USER_ROLES[],
    public status?: BASE_RECORD_STATES
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
    const {
      name,
      lastName,
      email,
      identityDocument,
      phoneNumber,
      roles,
      status,
    } = object;

    if (
      roles &&
      (!Array.isArray(roles) ||
        roles.some((role) => !Object.values(USER_ROLES).includes(role)))
    ) {
      return ["Las roles no son válidas"];
    }
    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new UpdateUserDto(
        name,
        lastName,
        email,
        identityDocument,
        phoneNumber,
        roles,
        status
      ),
    ];
  }
}
