import { BuildingDataSource } from "../../domain/datasources";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterBuildingDto,
  UpdateBuildingDto,
} from "../../domain/dtos";
import { BuildingEntity } from "../../domain/entities";
import { BuildingRepository } from "../../domain/repositories";

export class BuildingRepositoryImpl implements BuildingRepository {
  constructor(private readonly buildingDataSource: BuildingDataSource) {}

  list(): Promise<BuildingEntity[]> {
    return this.buildingDataSource.list();
  }

  findById(buildingId: IdBaseDto): Promise<BuildingEntity> {
    return this.buildingDataSource.findById(buildingId);
  }

  findOneByCode(buildingCode: CodeBaseDto): Promise<BuildingEntity> {
    return this.buildingDataSource.findOneByCode(buildingCode);
  }

  register(registerBuildingDto: RegisterBuildingDto): Promise<BuildingEntity> {
    return this.buildingDataSource.register(registerBuildingDto);
  }

  delete(buildingId: IdBaseDto): Promise<BuildingEntity> {
    return this.buildingDataSource.delete(buildingId);
  }

  update(
    buildingId: IdBaseDto,
    updateBuildingDto: UpdateBuildingDto
  ): Promise<BuildingEntity> {
    return this.buildingDataSource.update(buildingId, updateBuildingDto);
  }
}
