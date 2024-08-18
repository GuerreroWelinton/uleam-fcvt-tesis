import { BcryptAdapter } from "../../config";
import { BASE_RECORD_STATES, USER_ROLES } from "../../constants/constants";
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
        user,
        pagination: { skip, limit },
        name,
        lastName,
        email,
        identityDocument,
        phoneNumber,
        roles,
        status,
        createdAt,
        updatedAt,
      } = filters;

      const userRolesList = user.roles;

      let query: Object = {
        ...(name && { name: { $regex: name, $options: "i" } }),
        ...(lastName && { lastName: { $regex: lastName, $options: "i" } }),
        ...(email && { email: { $regex: email, $options: "i" } }),
        ...(identityDocument && {
          identityDocument: { $regex: identityDocument, $options: "i" },
        }),
        ...(phoneNumber && {
          phoneNumber: { $regex: phoneNumber, $options: "i" },
        }),
        status: { $ne: BASE_RECORD_STATES.DELETED },
        ...(status && { status }),
        ...(createdAt && { createdAt: { $gte: new Date(createdAt) } }),
        ...(updatedAt && { updatedAt: { $lte: new Date(updatedAt) } }),
      };

      if (userRolesList.includes(USER_ROLES.ADMIN)) {
        query = {
          ...query,
          ...(roles && { roles: { $in: roles } }),
        };
      } else {
        query = {
          ...query,
          ...(roles && {
            roles: { $in: roles, $nin: [...userRolesList, USER_ROLES.ADMIN] },
          }),
        };
      }

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
      const {
        name,
        lastName,
        email,
        identityDocument,
        password,
        phoneNumber,
        roles,
        status,
      } = registerUserDto;

      const existingEmail = await UserModel.findOne({
        email,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingEmail) {
        throw CustomError.badRequest(
          `Ya existe un usuario con el correo electrónico ${email}`
        );
      }

      const existingIdentityDocument = await UserModel.findOne({
        identityDocument,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();
      if (existingIdentityDocument) {
        throw CustomError.badRequest(
          `Ya existe un usuario con el número de identificación ${identityDocument}`
        );
      }

      const user = await UserModel.create({
        name,
        lastName,
        email,
        identityDocument,
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
      const emails = registerUserDto.map((user) => user.email);
      const uniqueEmails = new Set(emails);
      if (uniqueEmails.size !== registerUserDto.length) {
        throw CustomError.badRequest(
          "Hay correos electrónicos duplicados en la lista proporcionada."
        );
      }

      const identityDocuments = registerUserDto.map(
        (user) => user.identityDocument
      );
      const uniqueIdentityDocuments = new Set(identityDocuments);
      if (uniqueIdentityDocuments.size !== registerUserDto.length) {
        throw CustomError.badRequest(
          "Hay números de identificación duplicados en la lista proporcionada."
        );
      }

      const usersToRegister = [];
      for (const user of registerUserDto) {
        const {
          name,
          lastName,
          email,
          identityDocument,
          password,
          phoneNumber,
          roles,
          status,
        } = user;

        const existingEmail = await UserModel.findOne({
          email,
          status: { $ne: BASE_RECORD_STATES.DELETED },
        }).exec();

        if (existingEmail) {
          throw CustomError.badRequest(
            `Ya existe un usuario con el correo electrónico ${email}`
          );
        }

        const existingIdentityDocument = await UserModel.findOne({
          identityDocument,
          status: { $ne: BASE_RECORD_STATES.DELETED },
        }).exec();
        if (existingIdentityDocument) {
          throw CustomError.badRequest(
            `Ya existe un usuario con el número de identificación ${identityDocument}`
          );
        }

        usersToRegister.push({
          name,
          lastName,
          email,
          identityDocument,
          password: this.hashPassword(password),
          phoneNumber,
          roles,
          status,
        });
      }

      if (!usersToRegister.length) {
        throw CustomError.badRequest(
          "No se han proporcionado usuarios para registrar"
        );
      }

      const users = await UserModel.insertMany(usersToRegister);

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
      const {
        name,
        lastName,
        email,
        identityDocument,
        phoneNumber,
        roles,
        status,
      } = updateUserDto;

      const existingEmail = await UserModel.findOne({
        email,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingEmail) {
        throw CustomError.badRequest(
          `Ya existe un usuario con el correo electrónico ${email}`
        );
      }

      const existingIdentityDocument = await UserModel.findOne({
        identityDocument,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();
      if (existingIdentityDocument) {
        throw CustomError.badRequest(
          `Ya existe un usuario con el número de identificación ${identityDocument}`
        );
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        {
          ...(name && { name }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(identityDocument && { identityDocument }),
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
