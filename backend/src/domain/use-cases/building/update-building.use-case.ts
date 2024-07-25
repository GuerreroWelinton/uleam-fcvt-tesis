import { IdBaseDto, UpdateBuildingDto } from "../../dtos";
import { IApiResponse, IBuilding } from "../../interfaces";
import { BuildingRepository } from "../../repositories";

interface RegisterBuildingUseCase {
  execute(
    buildingId: IdBaseDto,
    updateBuildingDto: UpdateBuildingDto
  ): Promise<Partial<IApiResponse<IBuilding>>>;
}

export class UpdateBuilding implements RegisterBuildingUseCase {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async execute(
    buildingId: IdBaseDto,
    updateBuildingDto: UpdateBuildingDto
  ): Promise<Partial<IApiResponse<IBuilding>>> {
    await this.buildingRepository.update(buildingId, updateBuildingDto);

    return {
      message: `Edificio se ha actualizado con éxito`,
    };
  }
}
