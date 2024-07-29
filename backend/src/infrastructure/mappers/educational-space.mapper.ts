import { Validators } from "../../config";
import { BASE_RECORD_STATES } from "../../constants/constants";
import { EducationalSpaceEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { BuildingMapper } from "./building.mapper";
import { UserMapper } from "./user.mapper";

export class EducationalSpaceMapper {
  static educationalSpaceEntityFromObject(object: {
    [key: string]: any;
  }): EducationalSpaceEntity {
    const {
      _id,
      id,
      name,
      code,
      floor,
      capacity,
      // hoursOfOperation,
      buildingId,
      usersId,
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
    if (!floor) {
      throw CustomError.badRequest("Missing floor");
    }
    if (!capacity) {
      throw CustomError.badRequest("Missing capacity");
    }
    // if (!hoursOfOperation) {
    //   throw CustomError.badRequest("Missing hoursOfOperation");
    // }
    const buildingEntity = BuildingMapper.buildingEntityFromObject(buildingId);
    const usersEntity = usersId.map((user: any) => {
      return UserMapper.userEntityFromObject(user);
    });
    if (!Object.values(BASE_RECORD_STATES).includes(status)) {
      throw CustomError.badRequest("Invalid status");
    }
    if (!createdAt) {
      throw new Error("Missing createdAt");
    }
    if (!updatedAt) {
      throw new Error("Missing updatedAt");
    }

    return new EducationalSpaceEntity(
      _id || id,
      name,
      code,
      floor,
      capacity,
      // hoursOfOperation,
      buildingEntity,
      usersEntity,
      status,
      createdAt,
      updatedAt
    );
  }
}
