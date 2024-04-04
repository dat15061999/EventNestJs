import { Module } from '@nestjs/common';
import { EntityEvent } from './input/event.enity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './event.controller';
import { EventsService } from './events.service';
import { AttendeeEnity } from './attendee.entity';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { AttendeesService } from './attendee.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventAttendeesController } from './event-attendee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntityEvent, AttendeeEnity]),
  ],
  controllers: [
    EventsController,
    CurrentUserEventAttendanceController,
    EventAttendeesController,
    EventsOrganizedByUserController
  ],
  providers: [EventsService, AttendeesService]
})
export class EventsModule {

}
