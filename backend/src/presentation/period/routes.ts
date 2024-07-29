import { Router } from "express";
import {
  PeriodDataSourceImpl,
  PeriodRepositoryImpl,
} from "../../infrastructure";
import { AuthMiddleware } from "../middlewares";
import { PeriodController } from "./controller";

export class PeriodRoutes {
  static get routes() {
    const router = Router();

    const periodDataSource = new PeriodDataSourceImpl();
    const periodRepository = new PeriodRepositoryImpl(periodDataSource);
    const periodController = new PeriodController(periodRepository);

    router.get("/list", periodController.list);

    router.post(
      "/register",
      [AuthMiddleware.validateJWT],
      periodController.register
    );

    router.delete(
      "/delete/:id",
      [AuthMiddleware.validateJWT],
      periodController.delete
    );

    router.patch(
      "/update/:id",
      [AuthMiddleware.validateJWT],
      periodController.update
    );

    return router;
  }
}
