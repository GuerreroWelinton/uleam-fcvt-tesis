import { BASE_RECORD_STATES, USER_ROLES } from "../../constants/constants";
import { BookingModel, UserModel } from "../../data/mongodb";
import { BookingDataSource } from "../../domain/datasources";
import { ListBookingDto, RegisterBookingDto } from "../../domain/dtos";
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
        status: { $ne: BASE_RECORD_STATES.DELETED },
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
}
