import { Request, Response } from "express";
import {
  IdBaseDto,
  RegisterEducationalSpaceDto,
  UpdateEducationalSpaceDto,
} from "../../domain/dtos";
import { EducationalSpaceRepository } from "../../domain/repositories";
import {
  DeleteEducationalSpace,
  ListByUserIdEducationalSpace,
  ListEducationalSpace,
  RegisterEducationalSpace,
  UpdateEducationalSpace,
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
}
