import { Router } from "express";
import { AuthDataSourceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { AuthController } from "./controller";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authDataSource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(authDataSource);
    const authController = new AuthController(authRepository);

    router.post("/login", authController.loginUser);

    return router;
  }
}
