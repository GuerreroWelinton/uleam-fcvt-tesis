import { RegisterBuildingDto } from "../../dtos";
import { IApiResponse, IBuilding } from "../../interfaces";
import { BuildingRepository } from "../../repositories";

interface RegisterBuildingUseCase {
  execute(
    registerBuildingDto: RegisterBuildingDto
  ): Promise<Partial<IApiResponse<IBuilding>>>;
}

export class RegisterBuilding implements RegisterBuildingUseCase {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async execute(
    registerBuildingDto: RegisterBuildingDto
  ): Promise<Partial<IApiResponse<IBuilding>>> {
    const building = await this.buildingRepository.register(
      registerBuildingDto
    );
    const { code } = building;

    return {
      message: `Edificio con el código ${code} se ha registrado con éxito`,
    };
  }
}
