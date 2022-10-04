import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthLoginMiddleware implements NestMiddleware {
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
    const parts = token.split('.');
    if (!token.length || parts.length !== 3) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Некорректный токен' });
    }

    try {
      const isValid = this.authService.parseAccessToken(token);
      const user = await this.usersService.getUserByUid(isValid.uid);
      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Некорректный токен' });
      }

      req.body.user = user;
      next();
    } catch (e) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Некорректный токен' });
    }
  }
}
