import { Router } from "express";
import {
  EducationalSpaceDataSourceImpl,
  EducationalSpaceRepositoryImpl,
} from "../../infrastructure";
import { AuthMiddleware } from "../middlewares";
import { EducationalSpaceController } from "./controller";

export class EducationalSpaceRoutes {
  static get routes(): Router {
    const router = Router();

    const educationalSpaceDataSource = new EducationalSpaceDataSourceImpl();
    const educationalSpaceRepository = new EducationalSpaceRepositoryImpl(
      educationalSpaceDataSource
    );
    const educationalSpaceController = new EducationalSpaceController(
      educationalSpaceRepository
    );

    router.get(
      "/list",
      [AuthMiddleware.validateJWT],
      educationalSpaceController.list
    );

    router.post(
      "/register",
      [AuthMiddleware.validateJWT],
      educationalSpaceController.register
    );

    router.delete(
      "/delete/:id",
      [AuthMiddleware.validateJWT],
      educationalSpaceController.delete
    );

    router.patch(
      "/update/:id",
      [AuthMiddleware.validateJWT],
      educationalSpaceController.update
    );

    router.get(
      "/list-by-user/:id",
      [AuthMiddleware.validateJWT],
      educationalSpaceController.listByUserId
    );

    return router;
  }
}
