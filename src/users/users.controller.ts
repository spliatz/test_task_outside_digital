import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { UsersService } from './users.service';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUser(@Body() body: AuthUserDto) {
    console.log(body.user)
    return {
      email: body.user.email,
      nickname: body.user.nickname,
      tags: [],
    };
  }

  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Put()
  async editUser(@Body() body: EditUserDto) {
    try {
      const response = await this.usersService.editUser(body);
      return {
        email: response.email,
        nickname: response.nickname,
      };
    } catch (e) {
      throw new HttpException(
        { message: e.toString()},
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
