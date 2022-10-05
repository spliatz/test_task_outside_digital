import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus, Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { UsersService } from './users.service';
import { EditUserDto } from './dto/edit-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { TagsServices } from '../tags/tags.services';
import { AttachTagsDto } from './dto/attach-tags.dto';
import {GetMyTagsDto} from "./dto/get-my-tags.dto";
import {User} from "../entities/users.entity";
import {DetachTagFromUserDto} from "./dto/detach-tag-from-user.dto";

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsServices,
  ) {}

  @UsePipes(ValidationPipe)
  @Get()
  async getUser(@Body() body: AuthUserDto) {
    const tags = await this.usersService.getUserAttachedTags(body.user);
    return {
      email: body.user.email,
      nickname: body.user.nickname,
      tags: tags,
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

  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post('tag')
  async attachTagsToUser(@Body() body: AttachTagsDto) {
    try {
      await this.tagsService.attachTagsToUser(body.user, body.tags);
      const tags = await this.usersService.getUserAttachedTags(body.user);
      return {
        tags: tags
      }
    } catch (e) {
      throw new HttpException({ message: e.toString() }, HttpStatus.FORBIDDEN);
    }
  }

  @UsePipes(ValidationPipe)
  @Get('tag/my')
  async getMyTags(@Body() body: GetMyTagsDto) {
    try {
      const tags = await this.tagsService.getMyTags(body.user)
      return {tags}
    } catch (e) {
      throw new HttpException({ message: e.toString() }, HttpStatus.FORBIDDEN);
    }
  }

  @Delete('tag/:id')
  async detachTag(@Body() body: DetachTagFromUserDto, @Param('id') id: number) {
    if (!Number(id)) {
      throw new HttpException({message: 'incorrect id'}, HttpStatus.BAD_REQUEST);
    }
    try {
      await this.tagsService.detachTagFromUser(body.user, id);
      const tags = await this.usersService.getUserAttachedTags(body.user);
      return {
        tags: tags
      }
    } catch (e) {
      throw new HttpException({ message: e.toString() }, HttpStatus.FORBIDDEN);
    }
  }
}
