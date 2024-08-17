import { Router } from "express";
import { UserDataSourceImpl, UserRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares";
import { UserController } from "./controller";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const userDataSource = new UserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(userDataSource);
    const userController = new UserController(userRepository);

    router.get("/list", [AuthMiddleware.validateJWT], userController.list);

    router.get(
      "/find-by-id/:id",
      [AuthMiddleware.validateJWT],
      userController.findById
    );

    router.post(
      "/register",
      [AuthMiddleware.validateJWT],
      userController.register
    );

    router.post(
      "/register-group",
      [AuthMiddleware.validateJWT],
      userController.registerGroup
    );

    router.delete(
      "/delete/:id",
      [AuthMiddleware.validateJWT],
      userController.delete
    );

    router.patch(
      "/update/:id",
      [AuthMiddleware.validateJWT],
      userController.update
    );

    return router;
  }
}
