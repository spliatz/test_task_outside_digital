import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../entities/tags.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthLoginMiddleware } from '../middlewares/auth-login.middleware';
import { TagsController } from './tags.controller';
import { TagsServices } from './tags.services';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Tag]),
  ],
  controllers: [TagsController],
  providers: [TagsServices],
  exports: [TagsServices],
})
export class TagsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthLoginMiddleware)
      .forRoutes(
          { path: '/tag', method: RequestMethod.ALL },
          { path: '/tag/:id', method: RequestMethod.ALL },
      );
  }
}
