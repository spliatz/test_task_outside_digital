import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { User } from '../entities/users.entity';
import {IGetTagById, IGetTags} from '../interfaces/tags.interface';
import {EditTagDto} from "./dto/edit-tag.dto";
import {DeleteTagDto} from "./dto/delete-tag.dto";

@Injectable()
export class TagsServices {
  @InjectRepository(Tag)
  private readonly repository: Repository<Tag>;

  async create(body: CreateTagDto): Promise<Tag> {
    const tag = new Tag();
    tag.name = body.name;
    tag.sortOrder = body.sortOrder;
    tag.creator = Promise.resolve(body.user);
    return this.repository.save(tag);
  }

  async getTags(
    sortByOrder: number,
    page: number = 1,
    length: number = 10,
  ): Promise<IGetTags> {

    let tags: Tag[]

    if (sortByOrder) {
      tags = await this.repository.find({
        where: { sortOrder: sortByOrder },
      });
    } else {
      tags = await this.repository.find()
    }

    const data = tags.map(async tag => {
      const creator = await tag.creator
      return {
        creator: {
          uid: creator.uid,
          nickname: creator.nickname,
        },
        name: tag.name,
        sortOrder: tag.sortOrder,
      }
    }).slice((page - 1) * length, length * page)
    return {
      data: await Promise.all(data),
      meta: {
        length,
        page,
        sortByOrder,
        quantity: tags.length,
      },
    };
  }

  async getById(id: number): Promise<IGetTagById> {
    const tag = await this.repository.findOne({ where: { id: id } });
    if (!tag) throw new Error('Тег не был найден')
    const creator = await tag.creator;
    return {
      creator: {
        nickname: creator.nickname,
        uid: creator.uid,
      },
      name: tag.name,
      sortOrder: tag.sortOrder,
    };
  }

  async attachTagsToUser(user: User, tags: number[]) {
    for (let i = 0; i < tags.length; i++) {
      const tag = await this.repository.findOne({ where: { id: tags[i] } });
      if (!tag) {
        throw new Error(`Тега с id ${tags[i]} не существует`);
      }
    }

    for (let i = 0; i < tags.length; i++) {
      const tag = await this.repository.findOne({ where: { id: tags[i] } });
      const usersAttachedToTag = await tag.users;

      // если тег уже привязан к пользователю, пропускаем его
      if (usersAttachedToTag.filter((u) => u.uid === user.uid).length) {
        continue;
      }
      tag.users = Promise.resolve([...(await tag.users), user]);
      await this.repository.save(tag);
    }
  }

  async detachTagFromUser(user: User, tagId: number) {
    const tag = await this.repository.findOne({where: {id: tagId}})
    if (!tag) throw new Error('Тег не был найден')
    const attachedUsers = await tag.users
    tag.users = Promise.resolve(attachedUsers.filter(u => u.uid !== user.uid))
    await this.repository.save(tag)
  }

  public async getMyTags(user: User): Promise<Tag[]> {
    return this.repository.find({where: {creator: {uid: user.uid}}})
  }

  async editTag({user, name, sortOrder}: EditTagDto, tagId: number): Promise<Tag> {
    const tag = await this.repository.findOne({
      where: {id: tagId}
    })

    if (!tag) {
      throw new Error('Тег не был найден')
    }

    const creator = await tag.creator

    if (creator.uid !== user.uid) {
      throw new Error('Только создатель может редактировать тег')
    }

    if (name) tag.name = name
    if (sortOrder || sortOrder === 0) tag.sortOrder = sortOrder

    return this.repository.save(tag)
  }

  async deleteTag({user}: DeleteTagDto, tagId: number) {
    const tag = await this.repository.findOne(
        {where: {id: tagId}
        })

    if (!tag) {
      throw new Error('Тег не был найден')
    }

    const creator = await tag.creator

    if (creator.uid !== user.uid) {
      throw new Error('Только создатель может удалить тег')
    }

    await this.repository.delete({id: tagId, creator: {uid: user.uid}})
  }

}
