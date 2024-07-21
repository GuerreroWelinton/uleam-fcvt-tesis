import { JwtAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos";
import { CustomError } from "../../errors";
import { IApiResponse, IUser } from "../../interfaces";
import { UserRepository } from "../../repositories";

// type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

interface RegisterUserUseCase {
  execute(
    registerUserDto: RegisterUserDto
  ): Promise<Partial<IApiResponse<IUser>>>;
}

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository // private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(
    registerUserDto: RegisterUserDto
  ): Promise<Partial<IApiResponse<IUser>>> {
    const user = await this.userRepository.register(registerUserDto);

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

    // const token = await this.signToken({ id });

    // if (!token) {
    //   throw CustomError.internalServer();
    // }

    return {
      message: `El usuario con el correo electrónico ${email} ha sido creado con éxito`,
      // token: token,
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
    };
  }
}
