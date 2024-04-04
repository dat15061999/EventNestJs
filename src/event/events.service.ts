import { Injectable, Body, Delete, Get, HttpCode, Logger, NotFoundException, Param, Patch, Post, ValidationPipe, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { CreateDTO } from './events.create.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EntityEvent, PaginatedEvents } from './input/event.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { AttendeeAnswerEnum, AttendeeEnity } from './attendee.entity';
import { ListEvents } from './input/list.events';
import { paginate, PaginateOptions } from './../pagination/paginator';
import { User } from 'src/auth/user.entity';

@Injectable()
export class EventsService {

  private readonly logger = new Logger(EventsService.name)

  constructor(
    @InjectRepository(EntityEvent)
    private readonly eventRepository: Repository<EntityEvent>,
    @InjectRepository(AttendeeEnity)
    private readonly attendeeRepository: Repository<AttendeeEnity>,
  ) { }

  private getEventsBaseQuery(): SelectQueryBuilder<EntityEvent> {
    return this.eventRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<EntityEvent> {
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
      paginateOptions: PaginateOptions
    ): Promise<PaginatedEvents> {
    return await paginate(
      this.getEventsWithAttendeeCountQuery(),
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
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const events = this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id=:id', { id });
    ;
    console.log(events);

    this.logger.debug(events.getSql());
    if (!events) {
      throw new NotFoundException();
    }
    return await events.getOne();
  };


  @Post()
  async createEvent(
    input: CreateDTO,
    user: User
  ): Promise<EntityEvent> {
    console.log(input);

    return await this.eventRepository.save(
      new EntityEvent({
        ...input,
        organizer: user,
      })
    )
  }


  @Patch('/:id')
  async updateEvent(
    @Param('id', ParseIntPipe) id,
    @Body(new ValidationPipe({ groups: ['update'], transform: true })) input: UpdateEventDto,
    event: EntityEvent
  ) {
    return await this.eventRepository.save(
      new EntityEvent({
        ...event,
        ...input,
      })
    );
  };

  @Delete('/:id')
  @HttpCode(204)
  async deleteEvent(
    id: number
  ): Promise<DeleteResult> {
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

  public async getEventOrganizedByUserIdPaginated(
    userId: number, paginateOptions: PaginateOptions
  ): Promise<PaginatedEvents> {
    return await paginate<EntityEvent>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginateOptions
    );
  }

  private getEventsOrganizedByUserIdQuery(
    userId: number
  ): SelectQueryBuilder<EntityEvent> {
    return this.getEventsBaseQuery()
      .where('e.organizedId = :userId', { userId });
    ;
  }
  public async getEventsAttendedByUserIdPaginated(
    userId: number, paginateOptions: PaginateOptions
  ): Promise<PaginatedEvents> {
    return await paginate<EntityEvent>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginateOptions
    );
  }

  private getEventsAttendedByUserIdQuery(
    userId: number
  ): SelectQueryBuilder<EntityEvent> {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('e.attdendees', 'a')
      .where('a.userId = :userId', { userId })
      ;
  }
}