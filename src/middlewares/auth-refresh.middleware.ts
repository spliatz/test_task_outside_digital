import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth/auth.service';
import { AuthRefreshDto } from '../auth/dto/auth-refresh.dto';

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
    const parts = token.split('.');
    if (!token.length || parts.length !== 3) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Некорректный токен' });
    }

    try {
      const verify = this.authService.parseRefreshToken(token);
      const dto = new AuthRefreshDto();
      dto.uid = verify.uid;
      const user = await this.usersService.getUserByUid(dto.uid);
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Невалидный refresh token',
        });
      }

      const isValidData = await this.authService.findRefreshTokenByUser(user);
      if (!isValidData || isValidData.refresh_token !== token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Невалидный refresh token',
        });
      }
      req.body = dto;
      next();
    } catch (e) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Невалидный refresh token' });
    }
  }
}
