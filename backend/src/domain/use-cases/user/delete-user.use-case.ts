import { IdBaseDto } from "../../dtos";
import { IApiResponse, IUser } from "../../interfaces";
import { UserRepository } from "../../repositories";

interface DeleteUserUseCase {
  execute(userId: IdBaseDto): Promise<Partial<IApiResponse<IUser>>>;
}

export class DeleteUser implements DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: IdBaseDto): Promise<Partial<IApiResponse<IUser>>> {
    const user = await this.userRepository.delete(userId);
    const { email } = user;

    return {
      message: `Usuario con el email ${email} se ha eliminado con éxito`,
    };
  }
}
