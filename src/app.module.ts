import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllerEvent } from './events/event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityEvent } from './events/event.enity';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.Japan.service';
import { AppYummy } from './app.yummy';

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
    EventsModule
  ],
  controllers: [AppController],
  providers: [{
    provide: AppService,
    useClass: AppJapanService,
  },
  {
    provide: 'APP_NAME',
    useValue: 'This is class name',
  },
  {
    provide: 'MESSAGE',
    inject: [AppYummy],
    useFactory: (app) => `${app.yummy()} Factory!`
  }, AppYummy
  ],

})
export class AppModule { }
