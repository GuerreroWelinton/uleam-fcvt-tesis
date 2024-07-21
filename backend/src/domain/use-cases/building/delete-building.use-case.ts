import { IdBaseDto } from "../../dtos";
import { IApiResponse, IBuilding } from "../../interfaces";
import { BuildingRepository } from "../../repositories";

interface DeleteBuildingUseCase {
  execute(buildingId: IdBaseDto): Promise<Partial<IApiResponse<IBuilding>>>;
}

export class DeleteBuilding implements DeleteBuildingUseCase {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async execute(
    buildingId: IdBaseDto
  ): Promise<Partial<IApiResponse<IBuilding>>> {
    const building = await this.buildingRepository.delete(buildingId);
    const { code } = building;

    return {
      message: `Edificio con el código ${code} se ha eliminado con éxito`,
    };
  }
}
