import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;
const JWT_EXPIRES_IN = envs.JWT_EXPIRES_IN;

export class JwtAdapter {
  static async generateToken(
    payload: Object,
    duration: string = JWT_EXPIRES_IN
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        return resolve(token!);
      });
    });
  }

  static async verifyToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, token) => {
        if (err) return resolve(null);
        return resolve(token as T);
      });
    });
  }
}
