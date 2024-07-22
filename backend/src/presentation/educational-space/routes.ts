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
    const educationalSpaceRepository = new EducationalSpaceRepositoryImpl(educationalSpaceDataSource);
    const educationalSpaceController = new EducationalSpaceController(educationalSpaceRepository);

    router.get(
      "/list",
      //   [AuthMiddleware.validateJWT],
      educationalSpaceController.list
    );

    return router;
  }
}
