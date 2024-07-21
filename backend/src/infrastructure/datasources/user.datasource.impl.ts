import { BcryptAdapter } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { UserModel } from "../../data/mongodb";
import { UserDataSource } from "../../domain/datasources";
import { IdBaseDto, RegisterUserDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { UserMapper } from "../mappers";

type HashFunction = (password: string) => string;

export class UserDataSourceImpl implements UserDataSource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash
  ) {}

  async findById(userId: IdBaseDto): Promise<UserEntity> {
    return handleTryCatch<UserEntity>(async () => {
      const { id } = userId;
      const user = await UserModel.findById(id).exec();

      if (!user) {
        throw CustomError.notFound("El usuario que desea buscar no existe");
      }

      return UserMapper.userEntityFromObject(user);
    });
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return handleTryCatch<UserEntity>(async () => {
      const { name, lastName, email, password, phoneNumber, roles, status } =
        registerUserDto;

      const existingEmail = await UserModel.findOne({
        email,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      });

      if (existingEmail) {
        throw CustomError.badRequest(
          "Ya existe un usuario con este correo electrónico"
        );
      }

      const user = await UserModel.create({
        name,
        lastName,
        email,
        password: this.hashPassword(password),
        phoneNumber,
        roles,
        status,
      });
      await user.save();

      return UserMapper.userEntityFromObject(user);
    });
  }
}
