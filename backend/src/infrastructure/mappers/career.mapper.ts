import { Validators } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { CareerEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
export class CareerMapper {
  static careerEntityFromObject(object: { [key: string]: any }): CareerEntity {
    const {
      _id,
      id,
      name,
      code,
      numberOfLevels,
      description,
      status,
      createdAt,
      updatedAt,
    } = object;

    if (!_id || !id) {
      throw CustomError.badRequest("Missing id");
    }

    if (!Validators.id.test(_id || id)) {
      throw CustomError.badRequest("Id is not valid");
    }

    if (!name) {
      throw CustomError.badRequest("Missing name");
    }

    if (!code) {
      throw CustomError.badRequest("Missing code");
    }

    if (!numberOfLevels) {
      throw CustomError.badRequest("Missing number of levels");
    }

    if (!description) {
      throw CustomError.badRequest("Missing description");
    }

    if (!Object.values(BASE_RECORD_STATES).includes(status)) {
      throw CustomError.badRequest("Invalid status");
    }

    if (!createdAt) {
      throw new Error("Missing createdAt");
    }

    if (!updatedAt) {
      throw new Error("Missing updatedAt");
    }

    return new CareerEntity(
      _id || id,
      name,
      code,
      numberOfLevels,
      description,
      status,
      createdAt,
      updatedAt
    );
  }
}
