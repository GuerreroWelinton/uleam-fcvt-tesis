import { IdBaseDto } from "../../dtos";
import { IApiResponse, IUser } from "../../interfaces";
import { UserRepository } from "../../repositories";

interface FindByIdUserUseCase {
  execute(userId: IdBaseDto): Promise<Partial<IApiResponse<IUser>>>;
}

export class FindByIdUser implements FindByIdUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: IdBaseDto): Promise<Partial<IApiResponse<IUser>>> {
    const user = await this.userRepository.findById(userId);
    const {
      id,
      name,
      lastName,
      email,
      identityDocument,
      phoneNumber,
      roles,
      status,
      createdAt,
      updatedAt,
    } = user;

    return {
      message: "Usuario encontrado con éxito",
      data: {
        result: {
          id,
          name,
          lastName,
          email,
          identityDocument,
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
