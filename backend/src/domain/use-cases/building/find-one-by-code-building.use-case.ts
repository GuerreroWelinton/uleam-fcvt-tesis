import { CodeBaseDto } from "../../dtos";
import { IApiResponse, IBuilding } from "../../interfaces";
import { BuildingRepository } from "../../repositories";

interface FindOneByCodeBuildingUseCase {
  execute(buildingCode: CodeBaseDto): Promise<Partial<IApiResponse<IBuilding>>>;
}

export class FindOneByCodeBuilding implements FindOneByCodeBuildingUseCase {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async execute(
    buildingCode: CodeBaseDto
  ): Promise<Partial<IApiResponse<IBuilding>>> {
    const building = await this.buildingRepository.findOneByCode(buildingCode);
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
