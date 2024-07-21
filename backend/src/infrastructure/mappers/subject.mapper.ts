import { Validators } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { SubjectEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { CareerMapper } from "./career.mapper";

export class SubjectMapper {
  static subjectEntityFromObject(object: {
    [key: string]: any;
  }): SubjectEntity {
    const {
      _id,
      id,
      name,
      code,
      academicLevel,
      careerId,
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
    if (!academicLevel) {
      throw CustomError.badRequest("Missing academicLevel");
    }
    const careerEntity = CareerMapper.careerEntityFromObject(careerId);
    if (!Object.values(BASE_RECORD_STATES).includes(status)) {
      throw CustomError.badRequest("Invalid status");
    }
    if (!createdAt) {
      throw new Error("Missing createdAt");
    }
    if (!updatedAt) {
      throw new Error("Missing updatedAt");
    }

    return new SubjectEntity(
      _id || id,
      name,
      code,
      academicLevel,
      careerEntity,
      status,
      createdAt,
      updatedAt
    );
  }
}
