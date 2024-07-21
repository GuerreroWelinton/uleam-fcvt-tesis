import { Router } from "express";
import {
  CareerDataSourceImpl,
  CareerRepositoryImpl,
} from "../../infrastructure";
import { AuthMiddleware } from "../middlewares";
import { CareerController } from "./controller";

export class CareerRoutes {
  static get routes(): Router {
    const router = Router();

    const careerDataSource = new CareerDataSourceImpl();
    const careerRepository = new CareerRepositoryImpl(careerDataSource);
    const careerController = new CareerController(careerRepository);

    router.get("/list", [AuthMiddleware.validateJWT], careerController.list);

    router.get(
      "/find-by-id/:id",
      [AuthMiddleware.validateJWT],
      careerController.findById
    );

    router.get(
      "/find-one-by-code",
      [AuthMiddleware.validateJWT],
      careerController.findOneByCode
    );

    router.post(
      "/register",
      [AuthMiddleware.validateJWT],
      careerController.register
    );

    router.delete(
      "/delete/:id",
      [AuthMiddleware.validateJWT],
      careerController.delete
    );

    router.patch(
      "/update/:id",
      [AuthMiddleware.validateJWT],
      careerController.update
    );

    return router;
  }
}
