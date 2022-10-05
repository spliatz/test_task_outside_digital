import { User } from '../../entities/users.entity';
import { IsNotEmpty } from 'class-validator';

export class AttachTagsDto {
  @IsNotEmpty({ message: 'Не удалось распознать пользователя' })
  user: User;

  @IsNotEmpty({ message: 'Нет тегов' })
  tags: number[];
}
