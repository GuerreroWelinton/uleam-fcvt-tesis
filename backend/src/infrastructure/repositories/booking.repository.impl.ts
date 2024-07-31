import { BookingDataSource } from "../../domain/datasources";
import { ListBookingDto, RegisterBookingDto } from "../../domain/dtos";
import { BookingEntity } from "../../domain/entities";
import { BookingRepository } from "../../domain/repositories";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(private readonly bookingDataSource: BookingDataSource) {}

  list(listBookingDto: ListBookingDto): Promise<BookingEntity[]> {
    return this.bookingDataSource.list(listBookingDto);
  }

  register(registerBookingDto: RegisterBookingDto): Promise<BookingEntity> {
    return this.bookingDataSource.register(registerBookingDto);
  }
}
