import { Validators } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class UserMapper {
  static userEntityFromObject(object: { [key: string]: any }): UserEntity {
    const {
      _id,
      id,
      name,
      lastName,
      email,
      password,
      phoneNumber,
      roles,
      status,
      createdAt,
      updatedAt,
    } = object;

    if (!_id || !id) {
      throw CustomError.badRequest("Missing id");
    }
    if (!Validators.id.test(_id || id)) {
      throw CustomError.badRequest("Invalid id");
    }

    if (!name) {
      throw CustomError.badRequest("Missing name");
    }

    if (!lastName) {
      throw CustomError.badRequest("Missing lastName");
    }

    if (!email) {
      throw CustomError.badRequest("Missing email");
    }

    if (!Validators.email.test(email)) {
      throw CustomError.badRequest("Email is not valid");
    }

    if (!password) {
      throw CustomError.badRequest("Missing password");
    }

    if (!phoneNumber) {
      throw CustomError.badRequest("Missing phoneNumber");
    }

    if (!roles) {
      throw CustomError.badRequest("Missing roles");
    }

    if (!Object.values(BASE_RECORD_STATES).includes(status)) {
      throw CustomError.badRequest("Missing status");
    }

    if (!createdAt) {
      throw new Error("Missing createdAt");
    }

    if (!updatedAt) {
      throw new Error("Missing updatedAt");
    }

    return new UserEntity(
      _id || id,
      name,
      lastName,
      email,
      password,
      phoneNumber,
      roles,
      status,
      createdAt,
      updatedAt
    );
  }
}
