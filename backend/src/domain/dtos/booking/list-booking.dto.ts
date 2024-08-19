import { Validators } from "../../../config";
import { BOOKING_STATES } from "../../../constants/constants";
import { UserEntity } from "../../entities";

export class ListBookingDto {
  private constructor(
    public limit?: string,
    public page?: string,
    public id?: string,
    public startTime?: Date,
    public endTime?: Date,
    public topic?: string,
    public observation?: string,
    public teacherId?: string,
    public eduSpaceId?: string | string[],
    public subjectId?: string,
    public participants?: { userId: UserEntity; attended: boolean }[],
    public status?: BOOKING_STATES[],
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, ListBookingDto?] {
    const {
      limit,
      page,
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

    if (id && !Validators.id.test(id)) {
      return ["El id no es válido"];
    }
    if (teacherId && !Validators.id.test(teacherId)) {
      return ["El profesor no es válido"];
    }

    const eduSpaceIdArray: string[] =
      typeof eduSpaceId === "string"
        ? [eduSpaceId]
        : Array.isArray(eduSpaceId)
        ? eduSpaceId
        : [];

    for (const e of eduSpaceIdArray) {
      if (!Validators.id.test(e)) {
        return ["Uno de los espacios educativos no es válido"];
      }
    }

    if (subjectId && !Validators.id.test(subjectId)) {
      return ["La asignatura no es válida"];
    }
    if (participants && !Array.isArray(participants)) {
      return ["Los participantes no son válidos"];
    }

    let statusArray: BOOKING_STATES[] = [];
    if (status) {
      if (Array.isArray(status)) {
        statusArray = status;
      } else {
        statusArray = [status];
      }

      for (const s of statusArray) {
        if (!Object.values(BOOKING_STATES).includes(s)) {
          return ["Uno de los estados no es válido"];
        }
      }
    }

    return [
      undefined,
      new ListBookingDto(
        limit,
        page,
        id,
        startTime,
        endTime,
        topic,
        observation,
        teacherId,
        eduSpaceIdArray.length > 0 ? eduSpaceIdArray : undefined,
        subjectId,
        participants,
        status,
        createdAt,
        updatedAt
      ),
    ];
  }
}
