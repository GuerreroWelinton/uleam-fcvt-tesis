import { Request, Response } from "express";
import { ListBookingDto, RegisterBookingDto } from "../../domain/dtos";
import { BookingRepository } from "../../domain/repositories";
import { ListBooking, RegisterBooking } from "../../domain/use-cases";
import { createErrorResponse, handleError, handleSuccess } from "../../utils";

export class BookingController {
  constructor(private readonly bookingRepository: BookingRepository) {}

  list = (req: Request, res: Response) => {
    const [error, listBookingDto] = ListBookingDto.create(req.query);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new ListBooking(this.bookingRepository)
      .execute(listBookingDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };

  register = (req: Request, res: Response) => {
    const [error, registerBookingDto] = RegisterBookingDto.create(req.body);
    if (error) {
      const response = createErrorResponse(400, error);
      return res.status(400).json(response);
    }
    new RegisterBooking(this.bookingRepository)
      .execute(registerBookingDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
