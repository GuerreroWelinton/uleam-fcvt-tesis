import { Request, Response } from "express";
import { IdBaseDto, RegisterUserDto } from "../../domain/dtos";
import { UserRepository } from "../../domain/repositories";
import { FindByIdUser, RegisterUser } from "../../domain/use-cases";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

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
}
