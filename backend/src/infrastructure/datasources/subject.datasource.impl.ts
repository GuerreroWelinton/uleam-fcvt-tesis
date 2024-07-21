import { BASE_RECORD_STATES } from "../../constants/constants";
import { CareerModel, SubjectModel } from "../../data/mongodb";
import { SubjectDataSource } from "../../domain/datasources";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterSubjectDto,
  UpdateSubjectDto,
} from "../../domain/dtos";
import { SubjectEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { SubjectMapper } from "../mappers";

export class SubjectDataSourceImpl implements SubjectDataSource {
  constructor() {}

  async list(): Promise<SubjectEntity[]> {
    return handleTryCatch<SubjectEntity[]>(async () => {
      const subjects = await SubjectModel.find({
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .populate("careerId")
        .sort({ createdAt: -1 })
        .exec();

      return subjects.map((subject) => {
        return SubjectMapper.subjectEntityFromObject(subject);
      });
    });
  }

  async findById(subjectId: IdBaseDto): Promise<SubjectEntity> {
    return handleTryCatch<SubjectEntity>(async () => {
      const { id } = subjectId;
      const subject = await SubjectModel.findById(id)
        .populate("careerId")
        .exec();

      if (!subject) {
        throw CustomError.notFound("La asignatura que desea buscar no existe");
      }

      return SubjectMapper.subjectEntityFromObject(subject);
    });
  }

  async findOneByCode(careerCode: CodeBaseDto): Promise<SubjectEntity> {
    return handleTryCatch<SubjectEntity>(async () => {
      const { code } = careerCode;
      const subject = await SubjectModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .populate("careerId")
        .exec();

      if (!subject) {
        throw CustomError.notFound("La asignatura que desea buscar no existe");
      }

      return SubjectMapper.subjectEntityFromObject(subject);
    });
  }

  async register(
    registerSubjectDto: RegisterSubjectDto
  ): Promise<SubjectEntity> {
    return handleTryCatch<SubjectEntity>(async () => {
      const { name, code, academicLevel, careerId, status } =
        registerSubjectDto;

      const existCareer = await CareerModel.findOne({
        _id: careerId,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (!existCareer) {
        throw CustomError.notFound("La carrera que desea registrar no existe");
      }

      if (academicLevel > existCareer.numberOfLevels) {
        throw CustomError.conflict(
          "El nivel académico no puede ser mayor al permitido por la carrera "
        );
      }

      const existSubject = await SubjectModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existSubject) {
        throw CustomError.conflict(
          `Ya existe una asignatura con el código ${code}.`
        );
      }

      const subject = await SubjectModel.create({
        name,
        code,
        academicLevel,
        careerId,
        status,
      });
      await subject.save();

      const populatedSubject = await SubjectModel.findOne({
        _id: subject._id,
      })
        .populate("careerId")
        .exec();

      return SubjectMapper.subjectEntityFromObject(populatedSubject!);
    });
  }

  async delete(subjectId: IdBaseDto): Promise<SubjectEntity> {
    return handleTryCatch<SubjectEntity>(async () => {
      const { id } = subjectId;
      const deletedSubject = await SubjectModel.findOneAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { status: BASE_RECORD_STATES.DELETED },
        { new: true }
      )
        .populate("careerId")
        .exec();

      if (!deletedSubject) {
        throw CustomError.notFound(
          "La asignatura que desea eliminar no existe"
        );
      }

      return SubjectMapper.subjectEntityFromObject(deletedSubject);
    });
  }

  async update(
    subjectId: IdBaseDto,
    updateSubjectDto: UpdateSubjectDto
  ): Promise<SubjectEntity> {
    return handleTryCatch<SubjectEntity>(async () => {
      if (Object.keys(updateSubjectDto).every((value) => value === undefined)) {
        throw CustomError.badRequest(
          "Debe enviar al menos un dato para actualizar la asignatura"
        );
      }

      const { id } = subjectId;
      const { name, code, academicLevel, careerId, status } = updateSubjectDto;

      const existCareer = await CareerModel.findOne({
        _id: careerId,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (!existCareer) {
        throw CustomError.notFound("La carrera que desea registrar no existe");
      }

      if (academicLevel && academicLevel > existCareer.numberOfLevels) {
        throw CustomError.conflict(
          "El nivel académico no puede ser mayor al permitido por la carrera "
        );
      }

      const existingSubject = await SubjectModel.findOne({
        code,
        status: { $ne: BASE_RECORD_STATES.DELETED },
      }).exec();

      if (existingSubject) {
        throw CustomError.conflict(
          `Ya existe una asignatura con el código ${code}.`
        );
      }

      const updatedSubject = await SubjectModel.findOneAndUpdate(
        { _id: id, status: { $ne: BASE_RECORD_STATES.DELETED } },
        { name, code, academicLevel, careerId, status },
        { new: true, runValidators: true }
      )
        .populate("careerId")
        .exec();

      if (!updatedSubject) {
        throw CustomError.notFound(
          "La asignatura que desea actualizar no existe"
        );
      }

      return SubjectMapper.subjectEntityFromObject(updatedSubject);
    });
  }
}
