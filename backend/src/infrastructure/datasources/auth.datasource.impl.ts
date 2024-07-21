import { BcryptAdapter } from "../../config";
import { BASE_RECORD_STATES, USER_ROLES } from "../../constants/constants";
import { UserModel } from "../../data/mongodb";
import { AuthDataSource } from "../../domain/datasources";
import { LoginUserDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { UserMapper } from "../mappers";

type CompareFunction = (password: string, hashedPassword: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {
  constructor(
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return handleTryCatch<UserEntity>(async () => {
      const { email, password } = loginUserDto;

      const user = await UserModel.findOne({
        email,
        status: { $ne: BASE_RECORD_STATES.DELETED },
        roles: { $ne: USER_ROLES.STUDENT },
      }).exec();
      if (!user) {
        throw CustomError.unauthorized(
          "Usuario no encontrado, por favor verifique sus credenciales"
        );
      }

      if (user.status === BASE_RECORD_STATES.INACTIVE) {
        throw CustomError.unauthorized(
          "Usuario inactivo, por favor contacte al administrador"
        );
      }

      const isValidPassword = this.comparePassword(password, user.password);
      if (!isValidPassword) {
        throw CustomError.unauthorized("Credenciales incorrectas");
      }

      return UserMapper.userEntityFromObject(user);
    });
  }
}
