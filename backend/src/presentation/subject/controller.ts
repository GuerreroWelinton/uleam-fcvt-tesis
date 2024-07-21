import { Request, Response } from "express";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterSubjectDto,
  UpdateSubjectDto,
} from "../../domain/dtos";
import { SubjectRepository } from "../../domain/repositories";
import {
  DeleteSubject,
  FindByIdSubject,
  FindOneByCodeSubject,
  ListSubject,
  RegisterSubject,
  UpdateSubject,
} from "../../domain/use-cases";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";

export class SubjectController {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  list = (req: Request, res: Response) => {
    new ListSubject(this.subjectRepository)
      .execute()
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  findById = (req: Request, res: Response) => {
    const [error, subjectId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new FindByIdSubject(this.subjectRepository)
      .execute(subjectId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  findOneByCode = (req: Request, res: Response) => {
    const [error, subjectCode] = CodeBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new FindOneByCodeSubject(this.subjectRepository)
      .execute(subjectCode!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerSubjectDto] = RegisterSubjectDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new RegisterSubject(this.subjectRepository)
      .execute(registerSubjectDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  delete = (req: Request, res: Response) => {
    const [error, subjectId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new DeleteSubject(this.subjectRepository)
      .execute(subjectId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  update = (req: Request, res: Response) => {
    const [error, subjectId] = IdBaseDto.create(req.params);
    const [error2, updateSubjectDto] = UpdateSubjectDto.create(req.body);
    if (error || error2) {
      const response = createErrorResponse(400, (error || error2)!);
      return res.status(400).json(response);
    }
    new UpdateSubject(this.subjectRepository)
      .execute(subjectId!, updateSubjectDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
