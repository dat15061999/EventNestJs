import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityEvent } from './events/event.enity';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.Japan.service';
import { AppYummy } from './app.yummy';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production'
        ? ormConfig : ormConfigProd
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
