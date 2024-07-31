import { ListBookingDto } from "../../dtos";
import { IApiResponse, IBooking } from "../../interfaces";
import { BookingRepository } from "../../repositories";

interface ListBookingUseCase {
  execute(
    listBookingDto: ListBookingDto
  ): Promise<Partial<IApiResponse<IBooking[]>>>;
}

export class ListBooking implements ListBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(
    listBookingDto: ListBookingDto
  ): Promise<Partial<IApiResponse<IBooking[]>>> {
    const { bookings, total } = await this.bookingRepository.list(
      listBookingDto
    );

    return {
      message: `Reservas encontradas con éxito`,
      data: {
        result: bookings.map((booking) => {
          const {
            id,
            startTime,
            endTime,
            topic,
            observation,
            teacher,
            eduSpace,
            subject,
            participants,
            status,
            createdAt,
            updatedAt,
          } = booking;
          return {
            id,
            startTime,
            endTime,
            topic,
            observation,
            teacher,
            eduSpace,
            subject,
            participants,
            status,
            createdAt,
            updatedAt,
          };
        }),
        totalCount: total,
      },
    };
  }
}
