import { IdBaseDto, UpdateBookingDto } from "../../dtos";
import { IApiResponse, IBooking } from "../../interfaces";
import { BookingRepository } from "../../repositories";

interface UpdateBookingUseCase {
  execute(
    bookingId: IdBaseDto,
    updateBookingDto: UpdateBookingDto
  ): Promise<Partial<IApiResponse<IBooking>>>;
}

export class UpdateBooking implements UpdateBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(
    bookingId: IdBaseDto,
    updateBookingDto: UpdateBookingDto
  ): Promise<Partial<IApiResponse<IBooking>>> {
    await this.bookingRepository.update(bookingId, updateBookingDto);

    return {
      message: `Su reserva se ha actualizado con éxito`,
    };
  }
}
