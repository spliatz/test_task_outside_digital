import {User} from "../../entities/users.entity";
import {IsNotEmpty} from "class-validator";

export class DetachTagFromUserDto {
    @IsNotEmpty({ message: 'Невалидный пользователь' })
    user: User
}