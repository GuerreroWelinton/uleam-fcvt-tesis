import { Validators } from "../../../config";

export class RegisterBookingDto {
  private constructor(
    public startTime: Date,
    public endTime: Date,
    public topic: string,
    public observation: string,
    public teacherId: string,
    public eduSpaceId: string,
    public subjectId: string,
    public participants: { identityDocument: string }[]
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, RegisterBookingDto?] {
    const {
      startTime,
      endTime,
      topic,
      observation,
      teacherId,
      eduSpaceId,
      subjectId,
      participants,
    } = object;

    if (!topic) {
      return ["El tema es requerido"];
    }
    if (!startTime) {
      return ["La hora de inicio es requerida"];
    }
    if (!endTime) {
      return ["La hora de finalización es requerida"];
    }
    if (!observation) {
      return ["La observación es requerida"];
    }
    if (!teacherId) {
      return ["El profesor es requerido"];
    }
    if (!Validators.id.test(teacherId)) {
      return ["El profesor no es válido"];
    }
    if (!eduSpaceId) {
      return ["El espacio educativo es requerido"];
    }
    if (!Validators.id.test(eduSpaceId)) {
      return ["El espacio educativo no es válido"];
    }
    if (!subjectId) {
      return ["La asignatura es requerida"];
    }
    if (!Validators.id.test(subjectId)) {
      return ["La asignatura no es válida"];
    }
    if (!participants) {
      return ["Los participantes son requeridos"];
    }
    if (!Array.isArray(participants)) {
      return ["Los participantes no son válidos"];
    }
    if (!participants.length) {
      return ["Los participantes son requeridos"];
    }
    const identityDocuments = participants.map((p) => p.identityDocument);
    const uniqueIdentityDocuments = new Set(identityDocuments);
    if (identityDocuments.length !== uniqueIdentityDocuments.size) {
      return ["Los participantes no deben repetirse"];
    }

    return [
      undefined,
      new RegisterBookingDto(
        startTime,
        endTime,
        topic,
        observation,
        teacherId,
        eduSpaceId,
        subjectId,
        participants
      ),
    ];
  }
}
