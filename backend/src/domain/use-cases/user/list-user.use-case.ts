import { ListUserDto } from "../../dtos";
import { IApiResponse, IUser } from "../../interfaces";
import { UserRepository } from "../../repositories";

interface ListUserUseCase {
  execute(filters: ListUserDto): Promise<Partial<IApiResponse<IUser[]>>>;
}

export class ListUser implements ListUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(filters: ListUserDto): Promise<Partial<IApiResponse<IUser[]>>> {
    const { users, total } = await this.userRepository.list(filters);
    return {
      message: `Usuarios encontrados con éxito: ${total}`,
      data: {
        result: users.map((user) => {
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
          };
        }),
        totalCount: total,
      },
    };
  }
}
