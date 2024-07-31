import { BOOKING_STATES } from "../../constants/constants";
import { BookingModel } from "../../data/mongodb";
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

  async list(listBookingDto: ListBookingDto): Promise<BookingEntity[]> {
    return handleTryCatch<BookingEntity[]>(async () => {
      const bookings = await BookingModel.find()
        .populate([
          { path: "teacherId" },
          { path: "subjectId", populate: [{ path: "careerId" }] },
          {
            path: "eduSpaceId",
            populate: [{ path: "buildingId" }, { path: "usersId" }],
          },
        ])
        .sort({ createdAt: -1 })
        .exec();

      return bookings.map((booking) => {
        return BookingMapper.bookingEntityFromObject(booking);
      });
    });
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

      const queryExistingBooking = {
        startTime: {
          $lte: endTime,
        },
        endTime: {
          $gte: startTime,
        },
        eduSpaceId,
        status: { $ne: BOOKING_STATES.REJECTED },
      };
      const existingBooking = await BookingModel.findOne({
        ...queryExistingBooking,
      }).exec();

      if (existingBooking) {
        throw CustomError.conflict("Ya existe una reserva en ese horario");
      }

      const booking = await BookingModel.create({
        startTime,
        endTime,
        topic,
        observation,
        teacherId,
        eduSpaceId,
        subjectId,
        participants,
      });
      await booking.save();

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