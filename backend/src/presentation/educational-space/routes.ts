import { Router } from "express";
import {
  EducationalSpaceDataSourceImpl,
  EducationalSpaceRepositoryImpl,
} from "../../infrastructure";
import { AuthMiddleware, FileUploadMiddleware } from "../middlewares";
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

    router.post(
      "/upload-pdf/:id",
      [AuthMiddleware.validateJWT, FileUploadMiddleware.uploadPdfFile],
      educationalSpaceController.uploadPdf
    );

    router.get(
      "/list-pdf",
      [AuthMiddleware.validateJWT],
      educationalSpaceController.listPdf
    );

    router.delete(
      "/delete-pdf/:id",
      [AuthMiddleware.validateJWT],
      educationalSpaceController.deletePdf
    );

    return router;
  }
}
