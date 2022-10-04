import { IsEmail, IsString, Length } from 'class-validator';

export class AuthLoginDto {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email;

  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(8, 32, { message: 'Длина пароля не менее 8 символов и не более 64' })
  readonly password;
}
