import { PaginationDto } from "..";
import { BASE_RECORD_STATES, USER_ROLES } from "../../../constants/constants";

export class ListUserDto {
  private constructor(
    public pagination: PaginationDto,
    public name?: string,
    public lastName?: string,
    public email?: string,
    public phoneNumber?: string,
    public roles?: USER_ROLES[],
    public status?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, ListUserDto?] {
    const [error, pagination] = PaginationDto.create(object);
    if (error) return [error];

    const {
      name,
      lastName,
      email,
      phoneNumber,
      roles,
      status,
      createdAt,
      updatedAt,
    } = object;

    if (
      roles &&
      (!Array.isArray(roles) ||
        roles.some((role) => !Object.values(USER_ROLES).includes(role)))
    ) {
      return ["Los roles no son válidos"];
    }
    if (status && !Object.values(BASE_RECORD_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new ListUserDto(
        pagination!,
        name,
        lastName,
        email,
        phoneNumber,
        roles,
        status,
        createdAt,
        updatedAt
      ),
    ];
  }
}
