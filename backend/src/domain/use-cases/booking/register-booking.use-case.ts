import { RegisterBookingDto } from "../../dtos";
import { IApiResponse, IBooking } from "../../interfaces";
import { BookingRepository } from "../../repositories";

interface RegisterBookingUseCase {
  execute(
    registerBookingDto: RegisterBookingDto
  ): Promise<Partial<IApiResponse<IBooking>>>;
}

export class RegisterBooking implements RegisterBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(
    registerBookingDto: RegisterBookingDto
  ): Promise<Partial<IApiResponse<IBooking>>> {
    await this.bookingRepository.register(registerBookingDto);

    return {
      message: `Su reserva se ha registrado con éxito`,
    };
  }
}
