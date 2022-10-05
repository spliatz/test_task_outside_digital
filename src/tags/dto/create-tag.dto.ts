import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { User } from '../../entities/users.entity';
import {Optional} from "@nestjs/common";

export class CreateTagDto {
  @IsNotEmpty({ message: 'Невалидный пользователь' })
  user: User;

  @IsString({ message: 'Имя должно быть строкой' })
  @Length(8, 32, { message: 'Длина пароля не менее 2 символов и не более 32' })
  readonly name;

  @Optional()
  @IsNumber({}, { message: 'Порядковый номер должен быть числом' })
  readonly sortOrder: number;
}
