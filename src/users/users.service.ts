import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from '../auth/dto/auth-login.dto';
import { AuthRefreshDto } from '../auth/dto/auth-refresh.dto';

@Injectable()
export class UsersService {
  @InjectRepository(Users)
  private readonly repository: Repository<Users>;

  public async createUser({
    email,
    password,
    nickname,
  }: CreateUserDto): Promise<Users> {
    const user = new Users();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.nickname = nickname;
    return this.repository.save(user);
  }

  public async getUser({ email, password }: AuthLoginDto): Promise<Users> {
    const user = await this.repository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordCompare = await bcrypt.compare(password, user.password);

    if (!isPasswordCompare) {
      return null;
    }

    return user;
  }

  public async getUserByUid(uid: string): Promise<Users> {
    return this.repository.findOne({ where: { uid } });
  }

  public async getUserByNickName(nickname): Promise<Users> {
    return this.repository.findOne({
      where: {
        nickname: nickname,
      },
    });
  }
}
