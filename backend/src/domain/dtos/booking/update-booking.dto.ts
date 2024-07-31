import { Validators } from "../../../config";
import { BOOKING_STATES } from "../../../constants/constants";

export class UpdateBookingDto {
  private constructor(
    public startTime?: Date,
    public endTime?: Date,
    public topic?: string,
    public observation?: string,
    public teacherId?: string,
    public eduSpaceId?: string,
    public subjectId?: string,
    public participants?: { name: string }[],
    public status?: BOOKING_STATES
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateBookingDto?] {
    const {
      startTime,
      endTime,
      topic,
      observation,
      teacherId,
      eduSpaceId,
      subjectId,
      participants,
      status,
    } = object;

    if (teacherId && !Validators.id.test(teacherId)) {
      return ["El profesor no es válido"];
    }
    if (eduSpaceId && !Validators.id.test(eduSpaceId)) {
      return ["El espacio educativo no es válido"];
    }
    if (subjectId && !Validators.id.test(subjectId)) {
      return ["La asignatura no es válida"];
    }
    if (participants && !Array.isArray(participants)) {
      return ["Los participantes no son válidos"];
    }
    if (status && !Object.values(BOOKING_STATES).includes(status)) {
      return ["El estado no es válido"];
    }

    return [
      undefined,
      new UpdateBookingDto(
        startTime,
        endTime,
        topic,
        observation,
        teacherId,
        eduSpaceId,
        subjectId,
        participants,
        status
      ),
    ];
  }
}
