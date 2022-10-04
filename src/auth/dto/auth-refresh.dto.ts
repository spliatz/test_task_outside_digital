import { IsString } from 'class-validator';

export class AuthRefreshDto {
  @IsString({ message: 'ошибка идентификации пользователя' })
  uid: string;
}
