import { Validators } from "../../../config";
import { BASE_RECORD_STATES } from "../../../constants/constants";

export class ListFileUploadDto {
  constructor(
    public limit?: string,
    public page?: string,
    public id?: string,
    public originalName?: string,
    public path?: string,
    public mimetype?: string,
    public size?: number,
    public recordId?: string,
    public status?: BASE_RECORD_STATES[],
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, ListFileUploadDto?] {
    const {
      limit,
      page,
      id,
      originalName,
      path,
      mimetype,
      size,
      recordId,
      status,
      createdAt,
      updatedAt,
    } = object;

    if (id && !Validators.id.test(id)) {
      return ["El id no es válido."];
    }

    if (size && (typeof size !== "number" || size <= 0)) {
      return ["El tamaño del archivo es inválido."];
    }

    if (recordId && !Validators.id.test(id)) {
      return ["El id del registro asociado no es válido."];
    }

    let statusArray: BASE_RECORD_STATES[] = [];
    if (status) {
      if (Array.isArray(status)) {
        statusArray = status;
      } else {
        statusArray = [status];
      }
      for (const s of statusArray) {
        if (!Object.values(BASE_RECORD_STATES).includes(s)) {
          return ["Uno de los estados no es válido."];
        }
      }
    }

    let parsedCreatedAt: Date | undefined;
    let parsedUpdatedAt: Date | undefined;

    if (createdAt) {
      parsedCreatedAt = new Date(createdAt);
      if (isNaN(parsedCreatedAt.getTime())) {
        return ["La fecha de creación no es válida"];
      }
    }

    if (updatedAt) {
      parsedUpdatedAt = new Date(updatedAt);
      if (isNaN(parsedUpdatedAt.getTime())) {
        return ["La fecha de actualización no es válida"];
      }
    }

    return [
      undefined,
      new ListFileUploadDto(
        limit,
        page,
        id,
        originalName,
        path,
        mimetype,
        size,
        recordId,
        statusArray.length ? statusArray : undefined,
        parsedCreatedAt,
        parsedUpdatedAt
      ),
    ];
  }
}
