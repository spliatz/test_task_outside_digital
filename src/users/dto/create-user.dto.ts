import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email;

  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(8, 32, { message: 'Длина пароля не менее 8 символов и не более 64' })
  readonly password;

  @IsString({ message: 'Псевдоним должен быть строкой' })
  @Length(3, 32, {
    message: 'Длина псевдонима не менее 3 символов и не более 32',
  })
  readonly nickname;
}
