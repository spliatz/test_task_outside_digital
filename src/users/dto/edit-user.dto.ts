import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../../entities/users.entity';

export class EditUserDto {
  @IsNotEmpty({ message: 'Невалидный пользователь' })
  user: User;

  @IsOptional()
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(8, 32, { message: 'Длина пароля не менее 8 символов и не более 64' })
  readonly password: string;

  @IsOptional()
  @IsString({ message: 'Псевдоним должен быть строкой' })
  @Length(3, 32, {
    message: 'Длина псевдонима не менее 3 символов и не более 32',
  })
  readonly nickname: string;
}
