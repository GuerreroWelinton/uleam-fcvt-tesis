import { AuthDataSource } from "../../domain/datasources";
import { LoginUserDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { AuthRepository } from "../../domain/repositories";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authDataSource: AuthDataSource) {}
    
  login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.authDataSource.login(loginUserDto);
  }
}
   