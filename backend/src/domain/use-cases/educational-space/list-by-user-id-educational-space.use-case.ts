import { IdBaseDto } from "../../dtos";
import { IApiResponse, IEducationalSpace } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface ListByUserIdEducationalSpaceUseCase {
  execute(
    userId: IdBaseDto
  ): Promise<Partial<IApiResponse<IEducationalSpace[]>>>;
}

export class ListByUserIdEducationalSpace
  implements ListByUserIdEducationalSpaceUseCase
{
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}

  async execute(
    userId: IdBaseDto
  ): Promise<Partial<IApiResponse<IEducationalSpace[]>>> {
    const educationalSpaces =
      await this.educationalSpaceRepository.listByUserId(userId);

    return {
      message: `Espacios educativos encontrados con éxito`,
      data: {
        result: educationalSpaces.map((educationalSpace) => {
          const {
            id,
            name,
            code,
            floor,
            capacity,
            building,
            users,
            status,
            createdAt,
            updatedAt,
          } = educationalSpace;
          return {
            id,
            name,
            code,
            floor,
            capacity,

            building: {
              id: building.id,
              name: building.name,
              code: building.code,
              address: building.address,
              numberOfFloors: building.numberOfFloors,
              status: building.status,
              createdAt: building.createdAt,
              updatedAt: building.updatedAt,
            },
            users: users.map((user) => {
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
            status,
            createdAt,
            updatedAt,
          };
        }),
      },
    };
  }
}
