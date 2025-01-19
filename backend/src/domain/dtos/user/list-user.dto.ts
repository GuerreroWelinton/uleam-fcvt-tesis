import { Validators } from "../../../config";
import {
  BASE_RECORD_STATES,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  ERROR_MESSAGES,
  USER_ROLES,
} from "../../../constants/constants";

export class ListUserDto {
  private constructor(
    public limit: number,
    public page: number,
    public id?: string,
    public name?: string,
    public lastName?: string,
    public email?: string,
    public identityDocument?: string,
    public phoneNumber?: string,
    public roles?: USER_ROLES[],
    public status?: BASE_RECORD_STATES[],
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, ListUserDto?] {
    const {
      limit = DEFAULT_LIMIT,
      page = DEFAULT_PAGE,
      id,
      name,
      lastName,
      email,
      identityDocument,
      phoneNumber,
      roles,
      status,
      createdAt,
      updatedAt,
    } = object;

    if (id && !Validators.id.test(id)) return [ERROR_MESSAGES.INVALID("identificador")];

    if (email && !Validators.email.test(email))
      return [ERROR_MESSAGES.INVALID("correo electrónico")];

    if (roles && !Validators.isValidArrayElements(roles, Object.values(USER_ROLES)))
      return [ERROR_MESSAGES.INVALID("roles")];

    if (status && !Validators.isValidArrayElements(status, Object.values(BASE_RECORD_STATES)))
      return [ERROR_MESSAGES.INVALID("estado")];

    if (createdAt && !Validators.isValidDate(createdAt))
      return [ERROR_MESSAGES.INVALID("fecha de creación")];

    if (updatedAt && !Validators.isValidDate(updatedAt))
      return [ERROR_MESSAGES.INVALID("fecha de actualización")];

    return [
      undefined,
      new ListUserDto(
        parseInt(limit),
        parseInt(page),
        id,
        name,
        lastName,
        email,
        identityDocument,
        phoneNumber,
        roles ? (Array.isArray(roles) ? roles : [roles]) : undefined,
        status ? (Array.isArray(status) ? status : [status]) : undefined,
        createdAt ? new Date(createdAt) : undefined,
        updatedAt ? new Date(updatedAt) : undefined
      ),
    ];
  }
}
