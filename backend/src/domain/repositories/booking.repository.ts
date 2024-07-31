import {
  IdBaseDto,
  ListBookingDto,
  RegisterBookingDto,
  UpdateBookingDto,
} from "../dtos";
import { BookingEntity } from "../entities";

export abstract class BookingRepository {
  abstract list(
    listBookingDto: ListBookingDto
  ): Promise<{ bookings: BookingEntity[]; total: number }>;

  abstract register(
    registerBookingDto: RegisterBookingDto
  ): Promise<BookingEntity>;

  abstract update(
    bookingId: IdBaseDto,
    updateBookingDto: UpdateBookingDto
  ): Promise<BookingEntity>;
}
