import { BASE_RECORD_STATES } from "../../constants/constants";
import {
  BuildingModel,
  EducationalSpaceModel,
  UserModel,
} from "../../data/mongodb";
import { EducationalSpaceDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  RegisterEducationalSpaceDto,
  UpdateEducationalSpaceDto,
} from "../../domain/dtos";
import { EducationalSpaceEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { EducationalSpaceMapper } from "../mappers";

export class EducationalSpaceDataSourceImpl
  implements EducationalSpaceDataSource
{
  constructor() {}

  async list(): Promise<EducationalSpaceEntity[]> {
    return handleTryCatch<EducationalSpaceEntity[]>(async () => {
      const educationalSpacesPromise = await EducationalSpaceModel.find({
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .populate("buildingId")
        .populate("usersId")
        .sort({ createdAt: -1 })
        .exec();

      const totalPromise = EducationalSpaceModel.countDocuments({
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      const [educationalSpaces, total] = await Promise.all([
        educationalSpacesPromise,
        totalPromise,
      ]);

      return educationalSpaces.map((educationalSpace) => {
        return EducationalSpaceMapper.educationalSpaceEntityFromObject(
          educationalSpace
        );
      });
    });
  }

  async register(
    registerEducationalSpaceDto: RegisterEducationalSpaceDto
  ): Promise<EducationalSpaceEntity> {
    return handleTryCatch<EducationalSpaceEntity>(async () => {
      const {
        name,
        code,
        floor,
        capacity,
        // hoursOfOperation,
        buildingId,
        usersId,
        status,
      } = registerEducationalSpaceDto;

      const existingEducationalSpace = await EducationalSpaceModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      });
      if (existingEducationalSpace) {
        throw CustomError.badRequest(
          `Ya existe un espacio educativo con el código ${code}`
        );
      }

      const existingBuilding = await BuildingModel.findOne({
        _id: buildingId,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      });
      if (!existingBuilding) {
        throw CustomError.notFound("El edificio que desea asignar no existe");
      }

      if (existingBuilding.numberOfFloors < floor) {
        throw CustomError.badRequest(
          "El piso no puede ser mayor al número de pisos del edificio"
        );
      }

      const existingUsers: Array<string> = [];
      for (const userId of usersId) {
        const existingUser = await UserModel.findOne({
          _id: userId,
          status: { $ne: BASE_RECORD_STATES.DELETED },
        }).exec();

        if (!existingUser) {
          throw CustomError.notFound(
            `El o los usuarios que desea asignar no existen`
          );
        }
        existingUsers.push(userId);
      }

      const educationalSpace = await EducationalSpaceModel.create({
        name,
        code,
        floor,
        capacity,
        // hoursOfOperation,
        buildingId,
        usersId: existingUsers,
        status,
      });
      await educationalSpace.save();

      const populatedEducationalSpace = await EducationalSpaceModel.findOne({
        _id: educationalSpace._id,
      })
        .populate("buildingId")
        .populate("usersId")
        .exec();

      return EducationalSpaceMapper.educationalSpaceEntityFromObject(
        populatedEducationalSpace!
      );
    });
  }

  async delete(educationalSpaceId: IdBaseDto): Promise<EducationalSpaceEntity> {
    return handleTryCatch<EducationalSpaceEntity>(async () => {
      const { id } = educationalSpaceId;
      const deletedEducationalSpace =
        await EducationalSpaceModel.findByIdAndUpdate(
          { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
          { status: BASE_RECORD_STATES.DELETED },
          { new: true }
        )
          .populate("buildingId")
          .populate("usersId")
          .exec();

      if (!deletedEducationalSpace) {
        throw CustomError.notFound(
          `El espacio educativo que desea eliminar no existe`
        );
      }

      return EducationalSpaceMapper.educationalSpaceEntityFromObject(
        deletedEducationalSpace
      );
    });
  }

  async update(
    educationalSpaceId: IdBaseDto,
    updateEducationalSpaceDto: UpdateEducationalSpaceDto
  ): Promise<EducationalSpaceEntity> {
    return handleTryCatch<EducationalSpaceEntity>(async () => {
      if (
        Object.keys(updateEducationalSpaceDto).every(
          (value) => value === undefined
        )
      ) {
        throw CustomError.badRequest(
          "Debe enviar al menos un dato para actualizar el espacio educativo"
        );
      }

      const { id } = educationalSpaceId;
      const { name, code, floor, capacity, buildingId, usersId, status } =
        updateEducationalSpaceDto;

      const existingEducationalSpace = await EducationalSpaceModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();
      if (existingEducationalSpace) {
        throw CustomError.badRequest(
          `Ya existe un espacio educativo con el código ${code}`
        );
      }
      // TODO: HACERLO SI VIENE EL BUILDING ID SI NO NO
      // const existingBuilding = await BuildingModel.findOne({
      //   _id: buildingId,
      //   status: { $ne: BASE_RECORD_STATES.DELETED },
      // }).exec();
      // if (!existingBuilding) {
      //   throw CustomError.notFound("El edificio que desea asignar no existe");
      // }

      // if (floor && existingBuilding.numberOfFloors < floor) {
      //   throw CustomError.badRequest(
      //     "El piso no puede ser mayor al número de pisos del edificio"
      //   );
      // }

      const updatedEducationalSpace =
        await EducationalSpaceModel.findOneAndUpdate(
          { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
          {
            name,
            code,
            floor,
            capacity,
            buildingId,
            usersId,
            status,
          },
          { new: true }
        )
          .populate("buildingId")
          .populate("usersId")
          .exec();

      if (!updatedEducationalSpace) {
        throw CustomError.notFound(
          `El espacio educativo que desea actualizar no existe`
        );
      }

      return EducationalSpaceMapper.educationalSpaceEntityFromObject(
        updatedEducationalSpace
      );
    });
  }

  async listByUserId(userId: IdBaseDto): Promise<EducationalSpaceEntity[]> {
    return handleTryCatch<EducationalSpaceEntity[]>(async () => {
      const { id } = userId;
      const educationalSpaces = await EducationalSpaceModel.find({
        usersId: id,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .populate("buildingId")
        .populate("usersId")
        .sort({ createdAt: -1 })
        .exec();

      return educationalSpaces.map((educationalSpace) => {
        return EducationalSpaceMapper.educationalSpaceEntityFromObject(
          educationalSpace
        );
      });
    });
  }
}
