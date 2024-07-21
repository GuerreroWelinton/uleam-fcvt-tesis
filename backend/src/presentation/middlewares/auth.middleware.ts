import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header("Authorization");

    if (!authorization)
      return res.status(401).json({ error: "Not token provided" });

    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid Bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.verifyToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      const user = await UserModel.findById(payload.id);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid token - user not found" });
      }

      //* Este usuario es el que realiza la petición
      //TODO verificar que el ususario que viene de la petición tenga el status active
      req.body.user = user;

      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
