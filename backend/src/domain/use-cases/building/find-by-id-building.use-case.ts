import { IdBaseDto } from "../../dtos";
import { IApiResponse, IBuilding } from "../../interfaces";
import { BuildingRepository } from "../../repositories";

interface FindByIdBuildingUseCase {
  execute(buildingId: IdBaseDto): Promise<Partial<IApiResponse<IBuilding>>>;
}

export class FindByIdBuilding implements FindByIdBuildingUseCase {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async execute(
    buildingId: IdBaseDto
  ): Promise<Partial<IApiResponse<IBuilding>>> {
    const building = await this.buildingRepository.findById(buildingId);
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
      message: `Edificio encontrado con éxito`,
      data: {
        result: {
          id,
          name,
          code,
          address,
          numberOfFloors,
          status,
          createdAt,
          updatedAt,
        },
      },
    };
  }
}
