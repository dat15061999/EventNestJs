import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateDTO } from './events.create.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';

@Controller('/events')
export class ControllerEvent {

  constructor(
    private readonly eventsService: EventsService

  ) { }

  @Get('/practice')
  practive() {
    return this.eventsService.practive();
  }

  @Get('/practice2')
  practive2() {
    return this.eventsService.practive2();
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    const events = await this.eventsService
      .getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2
        }
      );
    return events;
  }


  @Get('/:id')
  getOne(@Param('id') id) {
    return this.eventsService.getOne(id);
  };


  @Post()
  createEvent(@Body(new ValidationPipe({ groups: ['create'] })) input: CreateDTO) {
    return this.eventsService.createEvent(input);
  };


  @Patch('/:id')
  updateEvent(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'], transform: true })) input: UpdateEventDto) {
    return this.eventsService.updateEvent(id, input);
  };


  @Delete('/:id')
  @HttpCode(204)
  async deleteEvent(@Param('id') id) {
    const result = await this.eventsService.deleteEvent(id);

    if (result.affected === 1) {
      throw new NotFoundException();
    }

  };


}