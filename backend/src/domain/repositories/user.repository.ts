import { IdBaseDto, RegisterUserDto } from "../dtos";
import { UserEntity } from "../entities";

export abstract class UserRepository {
  abstract findById(userId: IdBaseDto): Promise<UserEntity>;

  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
