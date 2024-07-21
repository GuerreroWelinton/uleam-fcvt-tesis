import { Request, Response } from "express";
import { LoginUserDto } from "../../domain/dtos";
import { AuthRepository } from "../../domain/repositories";
import { LoginUser } from "../../domain/use-cases";
import { createErrorResponse, handleError } from "../../utils/handleError";
import { handleSuccess } from "../../utils/handleSuccess";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
