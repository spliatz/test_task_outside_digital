import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from '../auth/dto/auth-login.dto';
import { EditUserDto } from './dto/edit-user.dto';
import {Tag} from "../entities/tags.entity";

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  public async createUser({
    email,
    password,
    nickname,
  }: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = await UsersService.hashPassword(password);
    user.nickname = nickname;
    return this.repository.save(user);
  }

  public async getUser({ email, password }: AuthLoginDto): Promise<User> {
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

  public async editUser(body: EditUserDto): Promise<User> {
    if (body.nickname) {
      // проверка на существование пользователя с таким же полем
      const nickNameExist = await this.getUserByNickName(body.nickname);
      if (nickNameExist) {
        throw new Error('Пользователь с таким псевдонимом уже существует');
      }

      body.user.nickname = body.nickname;
    }

    if (body.email) {
      // проверка на существование пользователя с таким же полем
      const emailExist = await this.repository.findOne({
        where: { email: body.email },
      });
      if (emailExist) {
        throw new Error('Пользователь с такой почтой уже существует');
      }

      body.user.email = body.email;
    }

    if (body.password) {
      body.user.password = await UsersService.hashPassword(body.password);
    }

    return this.repository.save(body.user);
  }

  public async deleteUser(user: User): Promise<DeleteResult> {
    return this.repository.delete({ uid: user.uid });
  }

  public async getUserByUid(uid: string): Promise<User> {
    return this.repository.findOne({ where: { uid } });
  }

  public async getUserByNickName(nickname): Promise<User> {
    return this.repository.findOne({
      where: {
        nickname: nickname,
      },
    });
  }

  public async getUserAttachedTags(user: User) {
    return user.tags;
  }

  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
