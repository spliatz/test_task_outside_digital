import {IsNotEmpty} from 'class-validator';
import {User} from "../../entities/users.entity";

export class AuthRefreshDto {
  @IsNotEmpty({message: 'Некорректный пользователь'})
  user: User
}
