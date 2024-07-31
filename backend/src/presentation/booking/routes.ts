import { Router } from "express";
import {
  BookingDataSourceImpl,
  BookingRepositoryImpl,
} from "../../infrastructure";
import { BookingController } from "./controller";
import { AuthMiddleware } from "../middlewares";

export class BookingRoutes {
  static get routes() {
    const router = Router();

    const bookingDataSource = new BookingDataSourceImpl();
    const bookingRepository = new BookingRepositoryImpl(bookingDataSource);
    const bookingController = new BookingController(bookingRepository);

    router.get(
      "/list",
      //   [AuthMiddleware.validateJWT],
      bookingController.list
    );

    router.post(
      "/register",
      //   [AuthMiddleware.validateJWT],
      bookingController.register
    );

    return router;
  }
}
