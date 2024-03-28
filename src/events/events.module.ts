import { Module } from '@nestjs/common';
import { EntityEvent } from './event.enity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerEvent } from './event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityEvent]),
  ],
  controllers: [ControllerEvent]
})
export class EventsModule {

}
