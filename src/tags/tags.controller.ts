import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {CreateTagDto} from './dto/create-tag.dto';
import {TagsServices} from './tags.services';
import {EditTagDto} from "./dto/edit-tag.dto";
import {DeleteTagDto} from "./dto/delete-tag.dto";

@Controller('tag')
export class TagsController {
    constructor(private readonly tagsServices: TagsServices) {
    }

    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createTag(@Body() body: CreateTagDto) {
        try {
            const tag = await this.tagsServices.create(body);
            return {
                id: tag.id,
                name: tag.name,
                sortOrder: tag.sortOrder,
            };
        } catch (e) {
            throw new HttpException(
                {message: 'tag creation error'},
                HttpStatus.FORBIDDEN,
            );
        }
    }

    @Get(':id')
    async getTagById(@Param('id') id) {
        if (!Number(id)) {
            throw new HttpException({message: 'incorrect id'}, HttpStatus.BAD_REQUEST);
        }
        try {
            return this.tagsServices.getById(Number(id));
        } catch (e) {
            throw new HttpException({message: e.toString()}, HttpStatus.FORBIDDEN);
        }
    }

    @Get()
    async getTags(
        @Query('sortByOrder') sortByOrder: number,
        @Query('page') page: number,
        @Query('length') length: number,
    ) {
        if (!page || page < 1) page = 1;
        if (!length || length < 1) length = 10;
        try {
            return this.tagsServices.getTags(sortByOrder, page, length);
        } catch (e) {
            throw new HttpException({message: e.toString()}, HttpStatus.FORBIDDEN);
        }
    }

    @Put(':id')
    async editTag(@Body() body: EditTagDto, @Param('id') id: number) {
        if (!Number(id)) {
            throw new HttpException({message: 'incorrect id'}, HttpStatus.BAD_REQUEST);
        }
        try {
            const tag = await this.tagsServices.editTag(body, id)
            if (!tag) {
                new HttpException({message: 'Тег не найден'}, HttpStatus.FORBIDDEN);
            }
            const creator = await tag.creator
            return {
                creator: {
                    uid: creator.uid,
                    nickname: creator.nickname,
                },
                name: tag.name,
                sortOrder: tag.sortOrder
            }
        } catch (e) {
            throw new HttpException({message: e.toString()}, HttpStatus.FORBIDDEN);
        }
    }

    @Delete(':id')
    async deleteTag(@Body() body: DeleteTagDto, @Param('id') id: number) {
        if (!Number(id)) {
            throw new HttpException({message: 'incorrect id'}, HttpStatus.BAD_REQUEST);
        }
        try {
            await this.tagsServices.deleteTag(body, id)
            return {ok: true}
        } catch (e) {
            throw new HttpException({message: e.toString()}, HttpStatus.FORBIDDEN);
        }
    }
}
