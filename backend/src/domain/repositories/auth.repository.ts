import { LoginUserDto } from "../dtos";
import { UserEntity } from "../entities";

export abstract class AuthRepository {
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
}
