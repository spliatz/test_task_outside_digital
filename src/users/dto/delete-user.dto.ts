import { IsNotEmpty } from 'class-validator';
import { User } from '../users.entity';

export class DeleteUserDto {
  @IsNotEmpty({ message: 'Невалидный пользователь' })
  user: User;
}
