import { Injectable, Body, Delete, Get, HttpCode, Logger, NotFoundException, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateDTO } from './events.create.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EntityEvent } from './input/event.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { AttendeeAnswerEnum, AttendeeEnity } from './attendee.entity';
import { ListEvents } from './input/list.events';
import { paginate, PaginateOptions } from './../pagination/paginator';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)

  constructor(
    @InjectRepository(EntityEvent)
    private readonly eventRepository: Repository<EntityEvent>,
    @InjectRepository(AttendeeEnity)
    private readonly attendeeRepository: Repository<AttendeeEnity>,
  ) { }

  private getEventsBaseQuery() {
    return this.eventRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap(
        'e.attendeeCount', 'e.attendees'
      )
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) => qb.where(
          'attendee.answer =:answer', {
          answer: AttendeeAnswerEnum.Accepted
        }
        ))
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) => qb.where(
          'attendee.answer =:answer', {
          answer: AttendeeAnswerEnum.Maybe
        }
        ))
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) => qb.where(
          'attendee.answer =:answer', {
          answer: AttendeeAnswerEnum.Rejected
        }
        ))

      ;
  }
  public async getEventsWithAttendeeCountFilteredPaginated
    (filter: ListEvents,
      paginateOptions: PaginateOptions) {
    return await paginate(
      await this.getEventsWithAttendeeCountQuery(),
      paginateOptions
    )
  }


  @Get()
  async practive2() {
    // return await this.attendeeRepository.findOne({
    //   where: { id: 1 },
    //   relations: ['attendees'],
    // });
    // const event = await this.eventRepository.findOne({
    //   where: { id: 1 },
    //   relations: ['attendees']
    // });
    // const event = new EntityEvent();
    // event.id = 1;

    // const attendee = new AttendeeEnity();
    // attendee.name = 'Merry the Second';
    // attendee.event = event;

    // event.attendees.push(attendee);
    // await this.attendeeRepository.save(attendee);
    // await this.eventRepository.save(event);

    return this.eventRepository.createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('e.id', 'ASC')
      .take(3)
      .getMany()
      ;

  }

  @Get('/:id')
  async getOne(@Param('id') id) {
    const events = this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id=:id', { id });
    ;


    this.logger.debug(events.getSql());


    return await events.getOne();
  };


  @Post()
  async createEvent(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateDTO
  ) {
    return await this.eventRepository.save({
      ...input,
    })
  };


  @Patch('/:id')
  async updateEvent(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'], transform: true })) input: UpdateEventDto) {
    const index = await this.eventRepository.findOne({ where: { id: id }, });
    return await this.eventRepository.save({
      ...index,
      ...input,
    });
  };


  @Delete('/:id')
  @HttpCode(204)
  async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventRepository
      .createQueryBuilder('e')
      .delete()
      .where('id=:id', { id })
      .execute();
    ;
  };

  @Get()
  practive() {
    return this.eventRepository.find();
  }
}