import { ERROR_MESSAGES } from "../../../constants/constants";

export class UpdatePasswordUserDto {
  private constructor(public id: string, public password: string, public newPassword: string) {}

  static create(object: { [key: string]: any }): [string?, UpdatePasswordUserDto?] {
    const { id, password, newPassword } = object;

    if (!id) return [ERROR_MESSAGES.REQUIRED("identificador")];
    if (!password) return [ERROR_MESSAGES.REQUIRED("contraseña")];
    if (!newPassword) return [ERROR_MESSAGES.REQUIRED("nueva contraseña")];

    return [undefined, new UpdatePasswordUserDto(id, password, newPassword)];
  }
}
