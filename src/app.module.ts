import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllerEvent } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityEvent } from './event.enity';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3300,
      username: 'root',
      password: 'example',
      database: 'nestjs-event',
      entities: [EntityEvent],
      synchronize: true,
    }),
  TypeOrmModule.forFeature([EntityEvent])
  ],
  controllers: [AppController, ControllerEvent],
  providers: [AppService],
})
export class AppModule { }
