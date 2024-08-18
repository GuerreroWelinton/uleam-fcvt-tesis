import {
  BASE_RECORD_STATES,
  BOOKING_STATES,
  USER_ROLES,
} from "../../constants/constants";
import {
  BookingModel,
  EducationalSpaceModel,
  SubjectModel,
  UserModel,
} from "../../data/mongodb";
import { BookingDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  ListBookingDto,
  RegisterBookingDto,
  UpdateBookingDto,
} from "../../domain/dtos";
import { BookingEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { handleTryCatch } from "../../utils";
import { BookingMapper } from "../mappers";

export class BookingDataSourceImpl implements BookingDataSource {
  constructor() {}

  async list(
    listBookingDto: ListBookingDto
  ): Promise<{ bookings: BookingEntity[]; total: number }> {
    return handleTryCatch<{ bookings: BookingEntity[]; total: number }>(
      async () => {
        const {
          limit,
          page,
          id,
          startTime,
          endTime,
          topic,
          observation,
          teacherId,
          eduSpaceId,
          subjectId,
          participants,
          status,
          createdAt,
          updatedAt,
        } = listBookingDto;

        let skip: number = 0;
        let formattedLimit: number = 0;
        if (limit && page) {
          const formattedPage = +page;
          formattedLimit = +limit;
          skip = formattedLimit * (formattedPage - 1);
        }

        const query = {
          ...(eduSpaceId && { eduSpaceId }),
          ...(startTime && { startTime: { $gte: new Date(startTime) } }),
          ...(endTime && { endTime: { $lte: new Date(endTime) } }),
          ...(id && { id }),
          ...(topic && { topic }),
          ...(observation && { observation }),
          ...(teacherId && { teacherId }),
          ...(subjectId && { subjectId }),
          ...(participants && { participants }),
          ...(status && { status: { $in: status } }),
          ...(createdAt && { createdAt: { $gte: new Date(createdAt) } }),
          ...(updatedAt && { updatedAt: { $lte: new Date(updatedAt) } }),
        };

        const bookings = await BookingModel.find(query)
          .populate([
            { path: "teacherId" },
            { path: "subjectId", populate: [{ path: "careerId" }] },
            {
              path: "eduSpaceId",
              populate: [{ path: "buildingId" }, { path: "usersId" }],
            },
            { path: "participants.userId" },
          ])
          .limit(formattedLimit)
          .skip(skip)
          .sort({ createdAt: -1 })
          .exec();

        const total = await BookingModel.countDocuments(query).exec();

        return {
          bookings: bookings.map((booking) =>
            BookingMapper.bookingEntityFromObject(booking)
          ),
          total,
        };
      }
    );
  }

  async register(
    registerBookingDto: RegisterBookingDto
  ): Promise<BookingEntity> {
    return handleTryCatch<BookingEntity>(async () => {
      const {
        startTime,
        endTime,
        topic,
        observation,
        teacherId,
        eduSpaceId,
        subjectId,
        participants,
      } = registerBookingDto;

      // Extraer los identityDocuments de los participantes
      const identityDocuments = participants.map((p) => p.identityDocument);

      // Buscar usuarios por sus identityDocuments
      const existingUsers = await UserModel.find({
        identityDocument: { $in: identityDocuments },
      }).exec();

      // Crear un mapa de identityDocument a userId
      const identityDocumentToUserId = new Map<string, string>();
      existingUsers.forEach((user) => {
        identityDocumentToUserId.set(
          user.identityDocument,
          user._id.toString()
        );
      });

      // Determinar los identityDocuments que no están registrados
      const missingIdentityDocuments = identityDocuments.filter((doc) => {
        return !identityDocumentToUserId.has(doc);
      });

      if (missingIdentityDocuments.length > 0) {
        throw CustomError.notFound(
          `Los siguientes números de cédula no están registrados en el sistema: ${missingIdentityDocuments.join(
            ", "
          )}. Por favor, verifica y corrige los números de cédula antes de continuar.`
        );
      }

      // Usar los _id de los usuarios encontrados
      const participantsWithUserIds = participants.map((p) => ({
        userId: identityDocumentToUserId.get(p.identityDocument), // Usar el _id aquí
        attended: false,
      }));

      // Verificar si ya existe una reserva en el mismo horario
      const queryExistingBooking = {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        eduSpaceId,
        status: { $ne: BOOKING_STATES.REJECTED },
      };
      const existingBooking = await BookingModel.findOne({
        ...queryExistingBooking,
      }).exec();

      if (existingBooking) {
        const existingStartDate = new Date(existingBooking.startTime);
        const existingEndDate = new Date(existingBooking.endTime);

        // Formatear la fecha y las horas
        const formattedDate = existingStartDate.toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedStartTime = existingStartDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedEndTime = existingEndDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        throw CustomError.conflict(
          `Ya existe una reserva para el espacio educativo el ${formattedDate} entre las ${formattedStartTime} y las ${formattedEndTime}. Por favor, elige otro horario o espacio educativo.`
        );
      }

      // Verificar la existencia del profesor
      const existingTeacher = await UserModel.findOne({
        _id: teacherId,
        roles: { $in: [USER_ROLES.TEACHER] },
        status: BASE_RECORD_STATES.ACTIVE,
      }).exec();
      if (!existingTeacher) {
        throw CustomError.notFound(
          `El profesor especificado no existe o no está activo.`
        );
      }

      // Verificar la existencia del espacio educativo
      const existingEduSpace = await EducationalSpaceModel.findOne({
        _id: eduSpaceId,
        status: BASE_RECORD_STATES.ACTIVE,
      }).exec();
      if (!existingEduSpace) {
        throw CustomError.notFound(
          `El espacio educativo especificado no existe o no está activo.`
        );
      }

      // Verificar la existencia de la materia
      const existingSubject = await SubjectModel.findOne({
        _id: subjectId,
        status: BASE_RECORD_STATES.ACTIVE,
      }).exec();
      if (!existingSubject) {
        throw CustomError.notFound(
          `La materia especificada no existe o no está activa.`
        );
      }

      // Crear la reserva
      const booking = await BookingModel.create({
        startTime,
        endTime,
        topic,
        observation,
        teacherId,
        eduSpaceId,
        subjectId,
        participants: participantsWithUserIds,
      });
      await booking.save();

      // Poblar la reserva con relaciones
      const populatedBooking = await BookingModel.findById(booking._id)
        .populate([
          { path: "teacherId" },
          { path: "subjectId", populate: [{ path: "careerId" }] },
          {
            path: "eduSpaceId",
            populate: [{ path: "buildingId" }, { path: "usersId" }],
          },
        ])
        .exec();

      return BookingMapper.bookingEntityFromObject(populatedBooking!);
    });
  }

  async update(
    bookingId: IdBaseDto,
    updateBookingDto: UpdateBookingDto
  ): Promise<BookingEntity> {
    return handleTryCatch<BookingEntity>(async () => {
      if (
        Object.values(updateBookingDto).every((value) => value === undefined)
      ) {
        throw CustomError.badRequest(
          "Debe enviar al menos un dato para actualizar el la reserva"
        );
      }

      const { id } = bookingId;

      const {
        startTime,
        endTime,
        topic,
        observation,
        teacherId,
        eduSpaceId,
        subjectId,
        participants,
        status,
      } = updateBookingDto;

      const query = {
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(topic && { topic }),
        ...(observation && { observation }),
        ...(teacherId && { teacherId }),
        ...(eduSpaceId && { eduSpaceId }),
        ...(subjectId && { subjectId }),
        ...(participants && { participants }),
        ...(status && { status }),
      };

      const updatedBooking = await BookingModel.findByIdAndUpdate(
        { _id: id, status: { $ne: BOOKING_STATES.REJECTED } },
        { ...query },
        { new: true }
      )
        .populate([
          { path: "teacherId" },
          { path: "subjectId", populate: [{ path: "careerId" }] },
          {
            path: "eduSpaceId",
            populate: [{ path: "buildingId" }, { path: "usersId" }],
          },
        ])
        .exec();

      if (!updatedBooking) {
        throw CustomError.notFound("La reserva que desea actualizar no existe");
      }

      return BookingMapper.bookingEntityFromObject(updatedBooking);
    });
  }
}
