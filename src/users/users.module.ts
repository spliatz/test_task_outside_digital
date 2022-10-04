import {forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UsersService} from './users.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './users.entity';
import {UsersController} from './users.controller';
import {AuthLoginMiddleware} from '../middlewares/auth-login.middleware';
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthLoginMiddleware).forRoutes(
        {path: '/user', method: RequestMethod.ALL},
    );
  }
}
