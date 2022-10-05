import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../../entities/users.entity';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Невалидный пользователь' })
  user: User;

  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 32, {
    message: 'Длина названия не менее 2 символов и не более 32',
  })
  readonly name;

  @IsOptional()
  @IsNumber({}, { message: 'Порядковый номер должен быть числом' })
  readonly sortOrder: number;
}
