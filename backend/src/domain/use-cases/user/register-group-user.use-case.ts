import { RegisterUserDto } from "../../dtos";
import { IApiResponse, IUser } from "../../interfaces";
import { UserRepository } from "../../repositories";

interface RegisterGroupUserUseCase {
  execute(
    registerUserDto: RegisterUserDto[]
  ): Promise<Partial<IApiResponse<IUser[]>>>;
}

export class RegisterGroupUser implements RegisterGroupUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(
    registerUserDto: RegisterUserDto[]
  ): Promise<Partial<IApiResponse<IUser[]>>> {
    await this.userRepository.registerGroup(registerUserDto);

    return {
      message: `Los usuarios han sido creados con éxito`,
    };
  }
}
