import { Validators } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { BuildingEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class BuildingMapper {
  static buildingEntityFromObject(object: {
    [key: string]: any;
  }): BuildingEntity {
    const {
      _id,
      id,
      name,
      code,
      address,
      numberOfFloors,
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

    if (!address) {
      throw CustomError.badRequest("Missing address");
    }

    if (!numberOfFloors) {
      throw CustomError.badRequest("Missing number of floors");
    }

    if (!Object.values(BASE_RECORD_STATES).includes(status)) {
      throw CustomError.badRequest("Missing status");
    }

    if (!createdAt) throw new Error("Missing createdAt");

    if (!updatedAt) throw new Error("Missing updatedAt");

    return new BuildingEntity(
      _id || id,
      name,
      code,
      address,
      numberOfFloors,
      status,
      createdAt,
      updatedAt
    );
  }
}
