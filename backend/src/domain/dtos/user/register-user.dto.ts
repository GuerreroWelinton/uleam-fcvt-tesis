import { Validators } from "../../../config";
import { BASE_RECORD_STATES, USER_ROLES } from "../../../constants/constants";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public lastName: string,
    public email: string,
    public identityDocument: string,
    public password: string,
    public phoneNumber: string,
    public roles?: USER_ROLES[],
    public status?: BASE_RECORD_STATES
  ) {
    this.roles = roles || [USER_ROLES.STUDENT];
    this.status = status || BASE_RECORD_STATES.ACTIVE;
  }

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const {
      name,
      lastName,
      email,
      identityDocument,
      password,
      phoneNumber,
      roles,
      status,
    } = object;

    if (!name) {
      return ["El nombre es requerido"];
    }
    if (!lastName) {
      return ["El apellido es requerido"];
    }
    if (!email) {
      return ["El correo electrónico es requerido"];
    }
    if (!identityDocument) {
      return ["El número de identificación es requerido"];
    }
    if (!Validators.email.test(email)) {
      return ["El correo electrónico no es válido"];
    }
    if (!password) {
      return ["La contraseña es requerida"];
    }
    if (!phoneNumber) {
      return ["El teléfono es requerido"];
    }
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
      new RegisterUserDto(
        name,
        lastName,
        email,
        identityDocument,
        password,
        phoneNumber,
        roles,
        status
      ),
    ];
  }

  static createGroup(
    objects: { [key: string]: any }[]
  ): [string[]?, RegisterUserDto[]?] {
    const errors: string[] = [];
    const dtos: RegisterUserDto[] = [];

    for (const object of objects) {
      const [error, dto] = RegisterUserDto.create(object);
      if (error) {
        errors.push(error);
      } else if (dto) {
        dtos.push(dto);
      }
    }

    if (errors.length > 0) {
      return [errors, undefined];
    }

    return [undefined, dtos];
  }
}
