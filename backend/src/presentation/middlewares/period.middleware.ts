import { NextFunction, Request, Response } from "express";
import { createErrorResponse, handleError, handleTryCatch } from "../../utils";
import { PeriodModel } from "../../data/mongodb/models/period.model";
import { PeriodEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { PeriodMapper } from "../../infrastructure/mappers";

export class PeriodMiddleware {
  static validateId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const periodCode = req.header("PeriodCode");

    if (!periodCode) {
      const response = createErrorResponse(400, "Period id not provided");
      return res.status(400).json(response);
    }

    const period = handleTryCatch<PeriodEntity>(async () => {
      const period = await PeriodModel.findOne({ code: periodCode });
      if (!period) {
        throw CustomError.notFound("Period not found");
      }
      return PeriodMapper.periodEntityFromObject(period);
    });

    period
      .then((period) => {
        req.body.periodId = period.id;
        next();
      })
      .catch((err) => handleError(err, res));
  };
}
