import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos";
import { CustomError } from "../../errors/custom.error";
import { IApiResponse, IUser } from "../../interfaces";
import { AuthRepository } from "../../repositories";

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<Partial<IApiResponse<IUser>>>;
}

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(
    loginUserDto: LoginUserDto
  ): Promise<Partial<IApiResponse<IUser>>> {
    const user = await this.authRepository.login(loginUserDto);

    const token = await this.signToken({ id: user.id, roles: user.roles });
    if (!token) throw CustomError.internalServer();

    const {
      id,
      name,
      lastName,
      email,
      phoneNumber,
      roles,
      status,
      createdAt,
      updatedAt,
    } = user;

    return {
      message: "Inicio de sesión con éxito",
      data: {
        result: {
          id,
          name,
          lastName,
          email,
          phoneNumber,
          roles,
          status,
          createdAt,
          updatedAt,
        },
      },
      token,
    };
  }
}
