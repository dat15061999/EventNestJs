import { Module } from '@nestjs/common';
import { EntityEvent } from './input/event.enity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerEvent } from './event.controller';
import { EventsService } from './events.service';
import { AttendeeEnity } from './attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityEvent, AttendeeEnity]),
  ],
  controllers: [ControllerEvent],
  providers: [EventsService]
})
export class EventsModule {

}
