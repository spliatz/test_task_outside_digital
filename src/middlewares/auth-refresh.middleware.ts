import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth/auth.service';
import {User} from "../entities/users.entity";
import {AuthRefreshDto} from "../auth/dto/auth-refresh.dto";

@Injectable()
export class AuthRefreshMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers.authorization.split(' ');
    const authType = headers[0];
    if (authType !== 'Bearer') {
      res
        .json({ message: 'Некорректный формат токена авторизации' })
        .status(HttpStatus.UNAUTHORIZED);
    }

    const token = headers[1];

    if (!token || !token.length) {
      res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Некорректный токен' });
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Некорректный токен' });
    }

    try {
      const verify = this.authService.parseRefreshToken(token);
      const user = new User()
      user.uid = verify.uid
      const refreshToken = await this.authService.findRefreshTokenByUser(user);
      if (!refreshToken || refreshToken.refresh_token !== token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Невалидный refresh token',
        });
      }
      const dto = new AuthRefreshDto()
      dto.user = await refreshToken.user
      req.body = dto;
      next();
    } catch (e) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Невалидный refresh token' });
    }
  }
}
