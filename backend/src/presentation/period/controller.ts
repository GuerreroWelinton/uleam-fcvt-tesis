import { Request, Response } from "express";
import { PeriodRepository } from "../../domain/repositories";
import {
  DeletePeriod,
  ListPeriod,
  RegisterPeriod,
  UpdatePeriod,
} from "../../domain/use-cases";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";
import { IdBaseDto, RegisterPeriodDto } from "../../domain/dtos";

export class PeriodController {
  constructor(private readonly periodRepository: PeriodRepository) {}

  list = (req: Request, res: Response) => {
    new ListPeriod(this.periodRepository)
      .execute()
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  //findById
  //findOneByCode

  register = (req: Request, res: Response) => {
    const [error, registerPeriodDto] = RegisterPeriodDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new RegisterPeriod(this.periodRepository)
      .execute(registerPeriodDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  delete = (req: Request, res: Response) => {
    const [error, periodId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new DeletePeriod(this.periodRepository)
      .execute(periodId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  update = (req: Request, res: Response) => {
    const [error, periodId] = IdBaseDto.create(req.params);
    const [error2, registerPeriodDto] = RegisterPeriodDto.create(req.body);
    if (error || error2) {
      const response = createErrorResponse(400, (error || error2)!);
      return res.status(400).json(response);
    }
    new UpdatePeriod(this.periodRepository)
      .execute(periodId!, registerPeriodDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
