import { BASE_RECORD_STATES } from "../../constants/constants";
import { BuildingModel } from "../../data/mongodb";
import { BuildingDataSource } from "../../domain/datasources";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterBuildingDto,
  UpdateBuildingDto,
} from "../../domain/dtos";
import { BuildingEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { BuildingMapper } from "../mappers";

export class BuildingDataSourceImpl implements BuildingDataSource {
  async list(): Promise<BuildingEntity[]> {
    return handleTryCatch<BuildingEntity[]>(async () => {
      const buildings = await BuildingModel.find({
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .sort({ createdAt: -1 })
        .exec();

      return buildings.map((building) => {
        return BuildingMapper.buildingEntityFromObject(building);
      });
    });
  }

  async findById(buildingId: IdBaseDto): Promise<BuildingEntity> {
    return handleTryCatch<BuildingEntity>(async () => {
      const { id } = buildingId;
      const building = await BuildingModel.findById(id).exec();

      if (!building) {
        throw CustomError.notFound("El edificio que desea buscar no existe");
      }

      return BuildingMapper.buildingEntityFromObject(building);
    });
  }

  async findOneByCode(buildingCode: CodeBaseDto): Promise<BuildingEntity> {
    return handleTryCatch<BuildingEntity>(async () => {
      const { code } = buildingCode;
      const building = await BuildingModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (!building) {
        throw CustomError.notFound("El edificio que desea buscar no existe");
      }

      return BuildingMapper.buildingEntityFromObject(building);
    });
  }

  async register(
    registerBuildingDto: RegisterBuildingDto
  ): Promise<BuildingEntity> {
    return handleTryCatch<BuildingEntity>(async () => {
      const { name, code, address, numberOfFloors, status } =
        registerBuildingDto;

      const existingBuilding = await BuildingModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingBuilding) {
        throw CustomError.conflict("Ya existe un edificio con el mismo código");
      }

      const building = await BuildingModel.create({
        name,
        code,
        address,
        numberOfFloors,
        status,
      });
      await building.save();

      return BuildingMapper.buildingEntityFromObject(building);
    });
  }

  async delete(buildingId: IdBaseDto): Promise<BuildingEntity> {
    return handleTryCatch<BuildingEntity>(async () => {
      const { id } = buildingId;
      const deletedBuilding = await BuildingModel.findOneAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { status: BASE_RECORD_STATES.DELETED },
        { new: true }
      ).exec();

      if (!deletedBuilding) {
        throw CustomError.notFound("El edificio que desea eliminar no existe");
      }

      return BuildingMapper.buildingEntityFromObject(deletedBuilding);
    });
  }

  async update(
    buildingId: IdBaseDto,
    updateBuildingDto: UpdateBuildingDto
  ): Promise<BuildingEntity> {
    return handleTryCatch<BuildingEntity>(async () => {
      if (
        Object.values(updateBuildingDto).every((value) => value === undefined)
      ) {
        throw CustomError.badRequest(
          "Debe enviar al menos un dato para actualizar el edificio"
        );
      }

      const { id } = buildingId;
      const { name, code, address, numberOfFloors, status } = updateBuildingDto;

      const existingBuilding = await BuildingModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingBuilding) {
        throw CustomError.conflict("Ya existe un edificio con el mismo código");
      }

      const updatedBuilding = await BuildingModel.findOneAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { name, code, address, numberOfFloors, status },
        { new: true, runValidators: true }
      ).exec();

      if (!updatedBuilding) {
        throw CustomError.notFound(
          "El edificio que desea actualizar no existe"
        );
      }
      return BuildingMapper.buildingEntityFromObject(updatedBuilding);
    });
  }
}
