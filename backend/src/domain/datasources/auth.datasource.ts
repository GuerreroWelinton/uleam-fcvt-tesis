import { LoginUserDto } from "../dtos";
import { UserEntity } from "../entities";

export abstract class AuthDataSource {
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
}
