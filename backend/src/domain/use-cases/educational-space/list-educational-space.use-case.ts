import { IApiResponse, IEducationalSpace } from "../../interfaces";
import { EducationalSpaceRepository } from "../../repositories";

interface ListEducationalSpaceUseCase {
  execute(): Promise<Partial<IApiResponse<IEducationalSpace[]>>>;
}

export class ListEducationalSpace implements ListEducationalSpaceUseCase {
  constructor(
    private readonly educationalSpaceRepository: EducationalSpaceRepository
  ) {}
  async execute(): Promise<Partial<IApiResponse<IEducationalSpace[]>>> {
    const educationalSpaces = await this.educationalSpaceRepository.list();

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
            // hoursOfOperation,
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
            // hoursOfOperation: hoursOfOperation.map((operation) => {
            //   const { dayOfWeek, startTime, endTime } = operation;
            //   return { dayOfWeek, startTime, endTime };
            // }),
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
                phoneNumber,
                identityDocument,
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
