import { Injectable } from '@nestjs/common';
import { Users } from '../users/users.entity';
import * as jwt from 'jsonwebtoken';
import { ITokens, ITokenVerify } from '../interfaces/tokens.interface';
import { AuthTokenEntity } from './auth-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  @InjectRepository(AuthTokenEntity)
  private readonly repository: Repository<AuthTokenEntity>;

  public async generateTokens(user: Users): Promise<ITokens> {
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);
    await this.addRefreshToken(refreshToken, user);
    return {
      accessToken: {
        token: accessToken,
        expiresIn: 60 * 30, // 30 минут
      },
      refreshToken: {
        token: refreshToken,
        expiresIn: 60 * 60 * 24 * 30, // 1 месяц
      },
    };
  }

  private async addRefreshToken(
    token: string,
    user: Users,
  ): Promise<AuthTokenEntity> {
    const candidate = await this.repository.findOne({ where: { user: user } });
    if (!candidate) {
      const refreshToken = new AuthTokenEntity();
      refreshToken.refresh_token = token;
      refreshToken.user = user;
      return this.repository.save(refreshToken);
    }

    candidate.refresh_token = token;
    return this.repository.save(candidate);
  }

  private static generateAccessToken({ nickname, uid }: Users): string {
    return jwt.sign(
      { uid: uid, nickname: nickname },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: '30m',
      },
    );
  }

  private static generateRefreshToken({ nickname, uid }: Users): string {
    return jwt.sign(
      { uid: uid, nickname: nickname },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: '30d',
      },
    );
  }

  public parseAccessToken(token: string) {
    const verify = jwt.verify(
      token,
      process.env.JWT_ACCESS_KEY,
    ) as ITokenVerify;
    return {
      uid: verify.uid,
      nickname: verify.nickname,
    };
  }

  public parseRefreshToken(token: string) {
    const verify = jwt.verify(
      token,
      process.env.JWT_REFRESH_KEY,
    ) as ITokenVerify;
    return {
      uid: verify.uid,
      nickname: verify.nickname,
    };
  }

  public async findRefreshTokenByUser(user: Users) {
    return this.repository.findOne({ where: { user: user } });
  }

  public removeRefreshToken(id: number) {
    return this.repository.delete(id);
  }
}
