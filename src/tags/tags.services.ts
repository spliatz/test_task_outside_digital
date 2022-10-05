import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsServices {
  @InjectRepository(Tag)
  private readonly repository: Repository<Tag>;
  async create(body: CreateTagDto): Promise<Tag> {
    const tag = new Tag();
    tag.name = body.name;
    tag.sortOrder = body.sortOrder;
    tag.creator = body.user.uid;
    return this.repository.save(tag);
  }

  async getById(id: number): Promise<Tag> {
    return this.repository.findOne({where: {id: id}})
  }
}
