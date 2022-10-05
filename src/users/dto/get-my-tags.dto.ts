import {IsNotEmpty} from "class-validator";
import {User} from "../../entities/users.entity";

export class GetMyTagsDto {
    @IsNotEmpty({ message: 'Невалидный пользователь' })
    user: User;
}