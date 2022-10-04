import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/users/users.entity';

export class AuthUserDto {
  @IsNotEmpty({ message: 'Невалидный пользователь' })
  user: Users;
}
