import { Validators } from "../../config";
import { BOOKING_STATES } from "../../constants/constants";
import { BookingEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { EducationalSpaceMapper } from "./educational-space.mapper";
import { SubjectMapper } from "./subject.mapper";
import { UserMapper } from "./user.mapper";

export class BookingMapper {
  static bookingEntityFromObject(object: {
    [key: string]: any;
  }): BookingEntity {
    const {
      _id,
      id,
      startTime,
      endTime,
      topic,
      observation,
      teacherId,
      eduSpaceId,
      subjectId,
      participants,
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
    if (!topic) {
      throw CustomError.badRequest("Missing topic");
    }
    if (!startTime) {
      throw CustomError.badRequest("Missing startTime");
    }
    if (!endTime) {
      throw CustomError.badRequest("Missing endTime");
    }
    if (!observation) {
      throw CustomError.badRequest("Missing observation");
    }
    if (!teacherId) {
      throw CustomError.badRequest("Missing teacherId");
    }
    const teacher = UserMapper.userEntityFromObject(teacherId);
    if (!eduSpaceId) {
      throw CustomError.badRequest("Missing eduSpaceId");
    }
    const eduSpace =
      EducationalSpaceMapper.educationalSpaceEntityFromObject(eduSpaceId);
    if (!subjectId) {
      throw CustomError.badRequest("Missing subjectId");
    }
    const subject = SubjectMapper.subjectEntityFromObject(subjectId);
    if (!participants) {
      throw CustomError.badRequest("Missing participants");
    }
    if (!Array.isArray(participants)) {
      throw CustomError.badRequest("Participants must be an array");
    }
    if (!Object.values(BOOKING_STATES).includes(status)) {
      throw CustomError.badRequest("Missing status");
    }
    if (!createdAt) {
      throw CustomError.badRequest("Missing createdAt");
    }
    if (!updatedAt) {
      throw CustomError.badRequest("Missing updatedAt");
    }

    return new BookingEntity(
      _id || id,
      startTime,
      endTime,
      topic,
      observation,
      teacher,
      eduSpace,
      subject,
      participants,
      status,
      createdAt,
      updatedAt
    );
  }
}
