import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfigService} from "./shared/typeorm/typeorm.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({useClass: TypeOrmConfigService}),
  ],
})
export class AppModule {}
