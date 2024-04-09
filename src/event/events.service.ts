import { Injectable, Get, Logger, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { CreateDTO } from './events.create.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EntityEvent, PaginatedEvents } from './input/event.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents } from './input/list.events';
import { paginate, PaginateOptions } from './../pagination/paginator';
import { User } from './../auth/user.entity';

@Injectable()
export class EventsService {

  private readonly logger = new Logger(EventsService.name)

  constructor(
    @InjectRepository(EntityEvent)
    private readonly eventRepository: Repository<EntityEvent>,
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


  public async practive2() {
    return this.eventRepository.createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('e.id', 'ASC')
      .take(3)
      .getMany()
      ;

  }

  public getOne(
    id: number
  ) {
    const events = this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id=:id', { id });
    ;
    console.log(events);

    this.logger.debug(events.getSql());
    if (!events) {
      throw new NotFoundException();
    }
    return events;
  };

  public async findOne(id: number): Promise<EntityEvent | undefined> {
    return await this.eventRepository.findOne({ where: { id: id } });
  }

  public async createEvent(
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

  public async updateEvent(
    input: UpdateEventDto,
    event: EntityEvent
  ): Promise<EntityEvent> {
    return await this.eventRepository.save(
      new EntityEvent({
        ...event,
        ...input,
      })
    );
  };

  public async deleteEvent(
    id: number
  ): Promise<DeleteResult> {
    return await this.eventRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

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