import { Request, Response } from "express";
import {
  IdBaseDto,
  ListBookingDto,
  RegisterBookingDto,
  UpdateBookingDto,
} from "../../domain/dtos";
import { BookingRepository } from "../../domain/repositories";
import {
  ListBooking,
  RegisterBooking,
  UpdateBooking,
} from "../../domain/use-cases";
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

  update = (req: Request, res: Response) => {
    const [error, bookingId] = IdBaseDto.create(req.params);
    const [error2, updateBookingDto] = UpdateBookingDto.create(req.body);
    if (error || error2) {
      const response = createErrorResponse(400, (error || error2)!);
      return res.status(400).json(response);
    }
    new UpdateBooking(this.bookingRepository)
      .execute(bookingId!, updateBookingDto!)
      .then((data) => handleSuccess(data, res))
      .catch((err) => handleError(err, res));
  };
}
