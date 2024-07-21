import { Router } from "express";
import {
  SubjectDataSourceImpl,
  SubjectRepositoryImpl,
} from "../../infrastructure";
import { AuthMiddleware } from "../middlewares";
import { SubjectController } from "./controller";

export class SubjectRoutes {
  static get routes(): Router {
    const router = Router();

    const subjectDataSource = new SubjectDataSourceImpl();
    const subjectRepository = new SubjectRepositoryImpl(subjectDataSource);
    const subjectController = new SubjectController(subjectRepository);

    router.get("/list", [AuthMiddleware.validateJWT], subjectController.list);

    router.get(
      "/find-by-id/:id",
      [AuthMiddleware.validateJWT],
      subjectController.findById
    );

    router.get(
      "/find-one-by-code",
      [AuthMiddleware.validateJWT],
      subjectController.findOneByCode
    );

    router.post(
      "/register",
      [AuthMiddleware.validateJWT],
      subjectController.register
    );

    router.delete(
      "/delete/:id",
      [AuthMiddleware.validateJWT],
      subjectController.delete
    );

    router.patch(
      "/update/:id",
      [AuthMiddleware.validateJWT],
      subjectController.update
    );

    return router;
  }
}
