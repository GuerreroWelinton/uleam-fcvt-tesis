import {
  IdBaseDto,
  ListUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from "../dtos";
import { UserEntity } from "../entities";

export abstract class UserDataSource {
  abstract list(
    filters: ListUserDto
  ): Promise<{ users: UserEntity[]; total: number }>;

  abstract findById(userId: IdBaseDto): Promise<UserEntity>;

  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

  abstract registerGroup(
    registerUserDto: RegisterUserDto[]
  ): Promise<UserEntity[]>;

  abstract delete(userId: IdBaseDto): Promise<UserEntity>;

  abstract update(
    userId: IdBaseDto,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity>;
}
