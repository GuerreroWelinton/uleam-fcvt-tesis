import { Request, Response } from "express";
import {
  IdBaseDto,
  ListFileUploadDto,
  RegisterEducationalSpaceDto,
  UpdateEducationalSpaceDto,
} from "../../domain/dtos";
import { EducationalSpaceRepository } from "../../domain/repositories";
import {
  DeleteEducationalSpace,
  DeletePdfEducationalSpace,
  ListByUserIdEducationalSpace,
  ListEducationalSpace,
  ListPdfEducationalSpace,
  RegisterEducationalSpace,
  UpdateEducationalSpace,
  UploadPdfEducationalSpace,
} from "../../domain/use-cases";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";

export class EducationalSpaceController {
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  list = (req: Request, res: Response) => {
    new ListEducationalSpace(this.educationalSpaceRepository)
      .execute()
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerEducationalSpaceDto] =
      RegisterEducationalSpaceDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new RegisterEducationalSpace(this.educationalSpaceRepository)
      .execute(registerEducationalSpaceDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  delete = (req: Request, res: Response) => {
    const [error, educationalSpaceId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new DeleteEducationalSpace(this.educationalSpaceRepository)
      .execute(educationalSpaceId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  update = (req: Request, res: Response) => {
    const [error, educationalSpaceId] = IdBaseDto.create(req.params);
    const [error2, updateEducationalSpaceDto] =
      UpdateEducationalSpaceDto.create(req.body);
    if (error || error2) {
      const response = createErrorResponse(400, (error || error2)!);
      return res.status(400).json(response);
    }
    new UpdateEducationalSpace(this.educationalSpaceRepository)
      .execute(educationalSpaceId!, updateEducationalSpaceDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  listByUserId = (req: Request, res: Response) => {
    const [error, userId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new ListByUserIdEducationalSpace(this.educationalSpaceRepository)
      .execute(userId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  uploadPdf = (req: Request, res: Response) => {
    const [error, educationalSpaceId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }

    if (!req.file) {
      return res.status(400).json(createErrorResponse(400, "No file uploaded"));
    }

    if (req.file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json(createErrorResponse(400, "Only PDF files are allowed"));
    }

    new UploadPdfEducationalSpace(this.educationalSpaceRepository)
      .execute(educationalSpaceId!, req.file)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  listPdf = (req: Request, res: Response) => {
    const [error, listFileUploadDto] = ListFileUploadDto.create(req.query);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new ListPdfEducationalSpace(this.educationalSpaceRepository)
      .execute(listFileUploadDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  deletePdf = (req: Request, res: Response) => {
    const [error, fileUploadId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new DeletePdfEducationalSpace(this.educationalSpaceRepository)
      .execute(fileUploadId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
