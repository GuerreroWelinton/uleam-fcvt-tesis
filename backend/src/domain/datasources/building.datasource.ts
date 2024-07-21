import {
  CodeBaseDto,
  IdBaseDto,
  RegisterBuildingDto,
  UpdateBuildingDto,
} from "../dtos";
import { BuildingEntity } from "../entities";

export abstract class BuildingDataSource {
  abstract list(): Promise<BuildingEntity[]>;

  abstract findById(buildingId: IdBaseDto): Promise<BuildingEntity>;

  abstract findOneByCode(buildingCode: CodeBaseDto): Promise<BuildingEntity>;

  abstract register(
    registerBuildingDto: RegisterBuildingDto
  ): Promise<BuildingEntity>;

  abstract delete(buildingId: IdBaseDto): Promise<BuildingEntity>;

  abstract update(
    buildingId: IdBaseDto,
    updateBuildingDto: UpdateBuildingDto
  ): Promise<BuildingEntity>;
}
