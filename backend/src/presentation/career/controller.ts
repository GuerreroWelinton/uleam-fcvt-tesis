import { Request, Response } from "express";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterCareerDto,
  UpdateCareerDto,
} from "../../domain/dtos";
import { CareerRepository } from "../../domain/repositories";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";
import {
  DeleteCareer,
  FindByIdCareer,
  FindOneByCodeCareer,
  ListCareer,
  RegisterCareer,
  UpdateCareer,
} from "../../domain/use-cases";

export class CareerController {
  constructor(private readonly careerRepository: CareerRepository) {}

  list = (req: Request, res: Response) => {
    new ListCareer(this.careerRepository)
      .execute()
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  findById = (req: Request, res: Response) => {
    const [error, careerId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new FindByIdCareer(this.careerRepository)
      .execute(careerId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  findOneByCode = (req: Request, res: Response) => {
    const [error, careerCode] = CodeBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new FindOneByCodeCareer(this.careerRepository)
      .execute(careerCode!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerCareerDto] = RegisterCareerDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new RegisterCareer(this.careerRepository)
      .execute(registerCareerDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  delete = (req: Request, res: Response) => {
    const [error, careerId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new DeleteCareer(this.careerRepository)
      .execute(careerId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  update = (req: Request, res: Response) => {
    const [error, careerId] = IdBaseDto.create(req.params);
    const [error2, updateCareerDto] = UpdateCareerDto.create(req.body);
    if (error || error2) {
      const response = createErrorResponse(400, (error || error2)!);
      return res.status(400).json(response);
    }
    new UpdateCareer(this.careerRepository)
      .execute(careerId!, updateCareerDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
