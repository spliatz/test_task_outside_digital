import {
  Body,
  Controller,
  Delete,
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
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUser(@Body() body: AuthUserDto) {
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
      throw new HttpException({ message: e.toString() }, HttpStatus.FORBIDDEN);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteUser(@Body() body: DeleteUserDto) {
    try {
      await this.usersService.deleteUser(body.user);
      return { ok: true };
    } catch (e) {
      throw new HttpException({ message: e.toString() }, HttpStatus.FORBIDDEN);
    }
  }
}
