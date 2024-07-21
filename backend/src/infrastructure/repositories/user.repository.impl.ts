import { AuthDataSource, UserDataSource } from "../../domain/datasources";
import { IdBaseDto, RegisterUserDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDataSource: UserDataSource) {}

  findById(userId: IdBaseDto): Promise<UserEntity> {
    return this.userDataSource.findById(userId);
  }

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.userDataSource.register(registerUserDto);
  }
}
