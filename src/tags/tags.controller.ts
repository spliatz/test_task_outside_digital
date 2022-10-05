import {
  Body,
  Controller, Get,
  HttpCode,
  HttpException,
  HttpStatus, Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsServices } from './tags.services';
import {UsersService} from "../users/users.service";

@Controller('tag')
export class TagsController {
  constructor(private readonly tagsServices: TagsServices, private readonly usersService: UsersService) {}

  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTag(@Body() body: CreateTagDto) {
    try {
      const tag = await this.tagsServices.create(body);
      return {
        id: tag.id,
        name: tag.name,
        sortOrder: tag.sortOrder
      }
    } catch (e) {
      throw new HttpException(
        { message: 'tag creation error' },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get(':id')
  async getTagById(@Param('id') id) {
    try {
      if (!Number(id)) {
        new HttpException(
            { message: 'incorrect id' },
            HttpStatus.BAD_REQUEST,
        );
      }

      const tag = await this.tagsServices.getById(Number(id))
      if (!tag) {
        new HttpException(
            { message: 'тег не был найден' },
            HttpStatus.FORBIDDEN,
        );
      }

      const creator = await this.usersService.getUserByUid(tag.creator)
      if (!creator) {
        new HttpException(
            { message: 'тег не был найден' },
            HttpStatus.FORBIDDEN,
        );
      }

      return {
        creator: {
          nickname: creator.nickname,
          uid: creator.uid,
        },
        id: tag.id,
        name: tag.name,
        sortOrder: tag.sortOrder
      }
    } catch (e) {
      throw new HttpException(
          { message: e.toString() },
          HttpStatus.FORBIDDEN,
      );
    }
  }
}
