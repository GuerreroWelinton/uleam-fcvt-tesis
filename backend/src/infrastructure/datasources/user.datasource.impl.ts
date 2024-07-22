import { BcryptAdapter } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { UserModel } from "../../data/mongodb";
import { UserDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  ListUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { UserMapper } from "../mappers";

type HashFunction = (password: string) => string;

export class UserDataSourceImpl implements UserDataSource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash
  ) {}

  async list(
    filters: ListUserDto
  ): Promise<{ users: UserEntity[]; total: number }> {
    return handleTryCatch<{ users: UserEntity[]; total: number }>(async () => {
      const {
        pagination: { skip, limit },
        name,
        lastName,
        email,
        phoneNumber,
        roles,
        status,
        createdAt,
        updatedAt,
      } = filters;

      let query = {
        ...(name && { name: { $regex: name, $options: "i" } }),
        ...(lastName && { lastName: { $regex: lastName, $options: "i" } }),
        ...(email && { email: { $regex: email, $options: "i" } }),
        ...(phoneNumber && {
          phoneNumber: { $regex: phoneNumber, $options: "i" },
        }),
        ...(roles && { roles: { $in: roles } }),
        status: { $ne: BASE_RECORD_STATES.DELETED },
        ...(status && { status }),
        ...(createdAt && { createdAt: { $gte: createdAt, $lte: createdAt } }),
        ...(updatedAt && { updatedAt: { $gte: updatedAt, $lte: updatedAt } }),
      };

      const usersPromise = UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const totalPromise = UserModel.countDocuments(query);

      const [users, total] = await Promise.all([usersPromise, totalPromise]);

      return {
        users: users.map((user) => UserMapper.userEntityFromObject(user)),
        total,
      };
    });
  }

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
      }).exec();

      if (existingEmail) {
        throw CustomError.badRequest(
          `Ya existe un usuario con el correo electrónico ${email}`
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

  async registerGroup(
    registerUserDto: RegisterUserDto[]
  ): Promise<UserEntity[]> {
    return handleTryCatch<UserEntity[]>(async () => {
      // await UserModel.collection.dropIndex("email_1");
      const emails = registerUserDto.map((user) => user.email);
      const uniqueEmails = new Set(emails);
      if (uniqueEmails.size !== registerUserDto.length) {
        throw CustomError.badRequest(
          "Hay correos electrónicos duplicados en la lista proporcionada."
        );
      }

      const group = registerUserDto.map(async (user) => {
        const { name, lastName, email, password, phoneNumber, roles, status } =
          user;

        const existingEmail = await UserModel.findOne({
          email,
          status: { $ne: BASE_RECORD_STATES.DELETED },
        }).exec();

        if (existingEmail) {
          throw CustomError.badRequest(
            `Ya existe un usuario con el correo electrónico ${email}`
          );
        }

        return {
          name,
          lastName,
          email,
          password: this.hashPassword(password),
          phoneNumber,
          roles,
          status,
        };
      });

      if (group.length === 0) {
        throw CustomError.badRequest(
          "No se han proporcionado usuarios para registrar"
        );
      }

      const users = await UserModel.insertMany(await Promise.all(group));

      return users.map((user) => UserMapper.userEntityFromObject(user));
    });
  }

  async delete(userId: IdBaseDto): Promise<UserEntity> {
    return handleTryCatch<UserEntity>(async () => {
      const { id } = userId;
      const deletedUser = await UserModel.findByIdAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { status: BASE_RECORD_STATES.DELETED },
        { new: true }
      ).exec();

      if (!deletedUser) {
        throw CustomError.notFound("El usuario que desea eliminar no existe");
      }

      return UserMapper.userEntityFromObject(deletedUser);
    });
  }

  async update(
    userId: IdBaseDto,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    return handleTryCatch<UserEntity>(async () => {
      if (Object.values(updateUserDto).every((value) => value === undefined)) {
        throw CustomError.badRequest(
          "Debe enviar al menos un dato para actualizar el usuario"
        );
      }

      const { id } = userId;
      const { name, lastName, email, phoneNumber, roles, status } =
        updateUserDto;

      const existingUser = await UserModel.findOne({
        email,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingUser) {
        throw CustomError.conflict(
          "Ya existe un usuario con el mismo correo electrónico"
        );
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        {
          ...(name && { name }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }),
          ...(roles && { roles }),
          ...(status && { status }),
        },
        { new: true }
      ).exec();

      if (!updatedUser) {
        throw CustomError.notFound("El usuario que desea actualizar no existe");
      }

      return UserMapper.userEntityFromObject(updatedUser);
    });
  }
}
