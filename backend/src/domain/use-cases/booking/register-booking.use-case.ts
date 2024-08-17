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
    const { startTime, endTime } = registerBookingDto;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const formattedDate = startDate.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedStartTime = startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedEndTime = endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      message: `Su reserva se ha registrado con éxito para el ${formattedDate} de ${formattedStartTime} hasta ${formattedEndTime}.`,
    };
  }
}
