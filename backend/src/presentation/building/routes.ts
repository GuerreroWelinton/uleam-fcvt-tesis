import { Router } from "express";
import {
  BuildingDataSourceImpl,
  BuildingRepositoryImpl,
} from "../../infrastructure";
import { AuthMiddleware } from "../middlewares";
import { BuildingController } from "./controller";

export class BuildingRoutes {
  static get routes() {
    const router = Router();

    const buildingDataSource = new BuildingDataSourceImpl();
    const buildingRepository = new BuildingRepositoryImpl(buildingDataSource);
    const careerController = new BuildingController(buildingRepository);

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
