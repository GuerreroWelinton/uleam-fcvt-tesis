import { IdBaseDto, UpdateUserDto } from "../../dtos";
import { IApiResponse, IUser } from "../../interfaces";
import { UserRepository } from "../../repositories";

interface UpdateUserUseCase {
  execute(
    userId: IdBaseDto,
    updateUserDto: UpdateUserDto
  ): Promise<Partial<IApiResponse<IUser>>>;
}

export class UpdateUser implements UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: IdBaseDto,
    updateUserDto: UpdateUserDto
  ): Promise<Partial<IApiResponse<IUser>>> {
    await this.userRepository.update(userId, updateUserDto);

    return {
      message: `El usuario se ha actualizado con éxito`,
    };
  }
}
