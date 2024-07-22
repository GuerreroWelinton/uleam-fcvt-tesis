import { Request, Response } from "express";
import { EducationalSpaceRepository } from "../../domain/repositories";
import { ListEducationalSpace } from "../../domain/use-cases";
import { handleError, handleSuccess } from "../../utils";

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
}
