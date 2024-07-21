import { Validators } from "../../../config";

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ["El correo electrónico es requerido"];
    if (!Validators.email.test(email))
      return ["El correo electrónico no es válido"];
    if (!password) return ["La contraseña es requerida"];
    // if (password.length < 6) return ["Password must be at least 6 characters"];

    return [undefined, new LoginUserDto(email, password)];
  }
}
