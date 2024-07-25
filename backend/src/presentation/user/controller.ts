import { Request, Response } from "express";
import {
  IdBaseDto,
  ListUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from "../../domain/dtos";
import { UserRepository } from "../../domain/repositories";
import {
  DeleteUser,
  FindByIdUser,
  ListUser,
  RegisterGroupUser,
  RegisterUser,
  UpdateUser,
} from "../../domain/use-cases";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  list = (req: Request, res: Response) => {
    const [error, filters] = ListUserDto.create({ ...req.body, ...req.query });
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new ListUser(this.userRepository)
      .execute(filters!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  findById = (req: Request, res: Response) => {
    const [error, userId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new FindByIdUser(this.userRepository)
      .execute(userId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new RegisterUser(this.userRepository)
      .execute(registerUserDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  registerGroup = (req: Request, res: Response) => {
    const [errors, registerUserDtos] = RegisterUserDto.createGroup(req.body);
    if (errors) {
      const response = createErrorResponse(400, errors.join(", "));
      return res.status(400).json(response);
    }
    new RegisterGroupUser(this.userRepository)
      .execute(registerUserDtos!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  delete = (req: Request, res: Response) => {
    const [error, userId] = IdBaseDto.create(req.params);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new DeleteUser(this.userRepository)
      .execute(userId!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  update = (req: Request, res: Response) => {
    const [error, userId] = IdBaseDto.create(req.params);
    const [error2, updateUserDto] = UpdateUserDto.create(req.body);
    if (error || error2) {
      const response = createErrorResponse(400, (error || error2)!);
      return res.status(400).json(response);
    }
    new UpdateUser(this.userRepository)
      .execute(userId!, updateUserDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
