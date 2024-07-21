import { Validators } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { PeriodEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class PeriodMapper {
  static periodEntityFromObject(object: { [key: string]: any }): PeriodEntity {
    const { _id, id, code, status, createdAt, updatedAt } = object;

    if (!_id || !id) {
      throw CustomError.badRequest("Missing id");
    }
    if (!Validators.id.test(_id || id)) {
      throw CustomError.badRequest("Id is not valid");
    }
    if (!code) {
      throw CustomError.badRequest("Missing code");
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

    return new PeriodEntity(_id || id, code, status, createdAt, updatedAt);
  }
}
