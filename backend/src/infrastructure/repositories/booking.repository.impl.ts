import { BookingDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  ListBookingDto,
  RegisterBookingDto,
  UpdateBookingDto,
} from "../../domain/dtos";
import { BookingEntity } from "../../domain/entities";
import { BookingRepository } from "../../domain/repositories";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(private readonly bookingDataSource: BookingDataSource) {}

  list(
    listBookingDto: ListBookingDto
  ): Promise<{ bookings: BookingEntity[]; total: number }> {
    return this.bookingDataSource.list(listBookingDto);
  }

  register(registerBookingDto: RegisterBookingDto): Promise<BookingEntity> {
    return this.bookingDataSource.register(registerBookingDto);
  }

  update(
    bookingId: IdBaseDto,
    updateBookingDto: UpdateBookingDto
  ): Promise<BookingEntity> {
    return this.bookingDataSource.update(bookingId, updateBookingDto);
  }
}
