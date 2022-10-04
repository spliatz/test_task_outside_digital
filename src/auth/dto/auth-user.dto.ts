import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/users.entity';

export class AuthUserDto {
  @IsNotEmpty({ message: 'Невалидный пользователь' })
  user: User;
}
