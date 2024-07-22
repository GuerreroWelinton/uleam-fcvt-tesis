import { UserDataSource } from "../../domain/datasources";
import {
  IdBaseDto,
  ListUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDataSource: UserDataSource) {}

  list(filters: ListUserDto): Promise<{ users: UserEntity[]; total: number }> {
    return this.userDataSource.list(filters);
  }

  findById(userId: IdBaseDto): Promise<UserEntity> {
    return this.userDataSource.findById(userId);
  }

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.userDataSource.register(registerUserDto);
  }

  registerGroup(registerUserDto: RegisterUserDto[]): Promise<UserEntity[]> {
    return this.userDataSource.registerGroup(registerUserDto);
  }

  delete(userId: IdBaseDto): Promise<UserEntity> {
    return this.userDataSource.delete(userId);
  }

  update(userId: IdBaseDto, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userDataSource.update(userId, updateUserDto);
  }
}
