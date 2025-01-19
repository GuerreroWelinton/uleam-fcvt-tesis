import { UpdatePasswordUserDto } from "../../dtos";
import { IApiResponse, IUser } from "../../interfaces";
import { UserRepository } from "../../repositories";

interface UpdatePasswordUserUseCase {
  execute(data: UpdatePasswordUserDto): Promise<Partial<IApiResponse<IUser>>>;
}

export class UpdatePasswordUser implements UpdatePasswordUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    data: UpdatePasswordUserDto
  ): Promise<Partial<IApiResponse<IUser>>> {
    await this.userRepository.updatePassword(data);

    return {
      message: `La contraseña del usuario se ha actualizado con éxito`,
    };
  }
}
