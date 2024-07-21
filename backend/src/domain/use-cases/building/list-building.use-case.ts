import { IApiResponse, IBuilding } from "../../interfaces";
import { BuildingRepository } from "../../repositories";

interface ListBuildingUseCase {
  execute(): Promise<Partial<IApiResponse<IBuilding[]>>>;
}

export class ListBuilding implements ListBuildingUseCase {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async execute(): Promise<Partial<IApiResponse<IBuilding[]>>> {
    const buildings = await this.buildingRepository.list();
    return {
      message: `Edificios encontradas con éxito`,
      data: {
        result: buildings.map((building) => {
          const {
            id,
            name,
            code,
            address,
            numberOfFloors,
            status,
            createdAt,
            updatedAt,
          } = building;

          return {
            id,
            name,
            code,
            address,
            numberOfFloors,
            status,
            createdAt,
            updatedAt,
          };
        }),
      },
    };
  }
}
