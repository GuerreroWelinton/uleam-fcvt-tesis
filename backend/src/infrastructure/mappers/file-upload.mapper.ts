import { BASE_RECORD_STATES } from "../../constants/constants";
import { FileUploadEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class FileUploadMapper {
  static fileUploadEntityFromObject(object: {
    [key: string]: any;
  }): FileUploadEntity {
    const {
      _id,
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

    if (!_id || !id) {
      throw CustomError.badRequest("Missing id");
    }

    if (!originalName) {
      throw CustomError.badRequest("Missing originalName");
    }

    if (!path) {
      throw CustomError.badRequest("Missing path");
    }

    if (!mimetype) {
      throw CustomError.badRequest("Missing mimetype");
    }

    if (!size) {
      throw CustomError.badRequest("Missing size");
    }

    if (!recordId) {
      throw CustomError.badRequest("Missing record");
    }

    if (!Object.values(BASE_RECORD_STATES).includes(status)) {
      throw CustomError.badRequest("Invalid status");
    }

    if (!createdAt) {
      throw CustomError.badRequest("Missing createdAt");
    }

    if (!updatedAt) {
      throw CustomError.badRequest("Missing updatedAt");
    }

    return new FileUploadEntity(
      _id || id,
      originalName,
      path,
      mimetype,
      size,
      recordId,
      status,
      createdAt,
      updatedAt
    );
  }
}
