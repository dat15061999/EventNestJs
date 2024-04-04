import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { AttendeesService } from "./attendee.service";

@Controller('events/:eventId/attendess')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventAttendeesController {
  constructor(
    private readonly attendeesService: AttendeesService
  ) { }
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return await this.attendeesService.findByEventId(eventId);
  }
}