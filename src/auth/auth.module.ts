import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthLoginMiddleware } from '../middlewares/auth-login.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenEntity } from './auth-token.entity';
import { AuthRefreshMiddleware } from '../middlewares/auth-refresh.middleware';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([AuthTokenEntity])],
  controllers: [AuthController],
  providers: [AuthService, UsersModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthLoginMiddleware)
      .forRoutes({ path: '/logout', method: RequestMethod.DELETE });
    consumer
      .apply(AuthRefreshMiddleware)
      .forRoutes({ path: '/refresh', method: RequestMethod.POST });
  }
}
