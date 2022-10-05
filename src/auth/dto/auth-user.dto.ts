import { IsNotEmpty } from 'class-validator';
import { User } from 'src/entities/users.entity';

export class AuthUserDto {
  @IsNotEmpty({ message: 'Невалидный пользователь' })
  user: User;
}
