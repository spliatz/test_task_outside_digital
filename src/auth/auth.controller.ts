import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response as httpResponse } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    let candidate = await this.userService.getUser(body);
    if (candidate) {
      throw new HttpException(
        { message: 'Такой пользователь уже есть' },
        HttpStatus.FORBIDDEN,
      );
    }

    candidate = await this.userService.getUserByNickName(body.nickname);
    if (candidate) {
      throw new HttpException(
        { message: 'Пользователь с таким псведонимом уже есть' },
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.createUser(body);
    if (!user) {
      new HttpException(
        { message: 'Ошибка регистрации' },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.authService.generateTokens(user);
  }

  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    const user = await this.userService.getUser(body);
    if (!user) {
      throw new HttpException(
        { message: 'Неверный email или пароль' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.authService.generateTokens(user);
  }

  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh')
  async refresh(@Body() body: AuthRefreshDto) {
    try {
      const user = await this.userService.getUserByUid(body.uid);
      if (!user) {
        new HttpException(
          { message: 'Refresh error' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.authService.generateTokens(user);
    } catch (e) {
      throw new HttpException(
        { message: 'Refresh error' },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  async logout(@Body() body: AuthUserDto, @Response() res: httpResponse) {
    try {
      const refreshTokenEntity = await this.authService.findRefreshTokenByUser(
        body.user,
      );
      await this.authService.removeRefreshToken(refreshTokenEntity.id);
      res.json({ ok: true });
    } catch (e) {
      throw new HttpException(
        { message: 'Logout error' },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
