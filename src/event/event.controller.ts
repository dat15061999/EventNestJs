import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, HttpCode, Injectable, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateDTO } from './events.create.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { User } from 'src/auth/user.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthGuardJwt } from 'src/auth/auth-guard.jswt';
import { EntityEvent } from './input/event.enity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventsController {

  constructor(
    private readonly eventsService: EventsService,
    @InjectRepository(EntityEvent)
    private readonly eventRepository: Repository<EntityEvent>

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
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Query() filter: ListEvents,
  ) {
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
  @UseInterceptors(ClassSerializerInterceptor)
  getOne(@Param('id', ParseIntPipe) id) {
    return this.eventsService.getOne(id);
  };


  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  createEvent(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateDTO,
    @CurrentUser() user: User
  ) {
    return this.eventsService.createEvent(input, user);
  };


  @Patch('/:id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEvent(
    @Param('id', ParseIntPipe) id,
    @Body(new ValidationPipe({ groups: ['update'], transform: true })) input: UpdateEventDto,
    @CurrentUser() user: User
  ) {
    const event = await this.eventRepository.findOne({ where: { id: id } });

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizedId !== user.id) {
      throw new ForbiddenException(
        null, `You are not authorized to update this event`
      )
    }
    return this.eventsService.updateEvent(id, input, event);
  };


  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)

  async deleteEvent(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() user: User
  ) {
    const event = await this.eventRepository.findOne({ where: { id: id } });

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizedId !== user.id) {
      throw new ForbiddenException(
        null, `You are not authorized to delete this event`
      )
    }

    await this.eventsService.deleteEvent(id);


  };


}