import { BASE_RECORD_STATES } from "../../constants/constants";
import { CareerModel } from "../../data/mongodb";
import { CareerDataSource } from "../../domain/datasources";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterCareerDto,
  UpdateCareerDto,
} from "../../domain/dtos";
import { CareerEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { CareerMapper } from "../mappers";

export class CareerDataSourceImpl implements CareerDataSource {
  constructor() {}

  async list(): Promise<CareerEntity[]> {
    return handleTryCatch<CareerEntity[]>(async () => {
      const careers = await CareerModel.find({
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .sort({ createdAt: -1 })
        .exec();

      return careers.map((career) => {
        return CareerMapper.careerEntityFromObject(career);
      });
    });
  }

  async findById(careerId: IdBaseDto): Promise<CareerEntity> {
    return handleTryCatch<CareerEntity>(async () => {
      const { id } = careerId;
      const career = await CareerModel.findById(id).exec();

      if (!career) {
        throw CustomError.notFound("La carrera que desea buscar no existe");
      }

      return CareerMapper.careerEntityFromObject(career);
    });
  }

  async findOneByCode(careerCode: CodeBaseDto): Promise<CareerEntity> {
    return handleTryCatch<CareerEntity>(async () => {
      const { code } = careerCode;
      const career = await CareerModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (!career) {
        throw CustomError.notFound("La carrera que desea buscar no existe");
      }

      return CareerMapper.careerEntityFromObject(career);
    });
  }

  async register(registerCareerDto: RegisterCareerDto): Promise<CareerEntity> {
    return handleTryCatch<CareerEntity>(async () => {
      const { name, code, numberOfLevels, description, status } =
        registerCareerDto;

      const existingCareer = await CareerModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingCareer) {
        throw CustomError.conflict(
          `Ya existe una carrera con el código ${code}`
        );
      }

      const career = await CareerModel.create({
        name,
        code,
        numberOfLevels,
        description,
        status,
      });
      await career.save();

      return CareerMapper.careerEntityFromObject(career);
    });
  }

  async delete(careerId: IdBaseDto): Promise<CareerEntity> {
    return handleTryCatch<CareerEntity>(async () => {
      const { id } = careerId;
      const deletedCareer = await CareerModel.findOneAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { status: BASE_RECORD_STATES.DELETED },
        { new: true }
      ).exec();

      if (!deletedCareer) {
        throw CustomError.notFound("La carrera que desea eliminar no existe");
      }

      return CareerMapper.careerEntityFromObject(deletedCareer);
    });
  }

  async update(
    careerId: IdBaseDto,
    updateCareerDto: UpdateCareerDto
  ): Promise<CareerEntity> {
    return handleTryCatch<CareerEntity>(async () => {
      if (
        Object.values(updateCareerDto).every((value) => value === undefined)
      ) {
        throw CustomError.badRequest(
          "Debe enviar al menos un dato para actualizar la carrera"
        );
      }

      const { id } = careerId;
      const { name, code, numberOfLevels, description, status } =
        updateCareerDto;

      const existingCareer = await CareerModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingCareer) {
        throw CustomError.conflict("Ya existe una carrera con el mismo código");
      }

      const updatedCareer = await CareerModel.findOneAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { name, code, numberOfLevels, description, status },
        { new: true, runValidators: true }
      ).exec();

      if (!updatedCareer) {
        throw CustomError.notFound("La carrera que desea actualizar no existe");
      }
      return CareerMapper.careerEntityFromObject(updatedCareer);
    });
  }
}
