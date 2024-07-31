import {
  IdBaseDto,
  ListBookingDto,
  RegisterBookingDto,
  UpdateBookingDto,
} from "../dtos";
import { BookingEntity } from "../entities";

export abstract class BookingDataSource {
  abstract list(listBookingDto: ListBookingDto): Promise<BookingEntity[]>;

  abstract register(
    registerBookingDto: RegisterBookingDto
  ): Promise<BookingEntity>;

  abstract update(
    bookingId: IdBaseDto,
    updateBookingDto: UpdateBookingDto
  ): Promise<BookingEntity>;
}
