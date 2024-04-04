import { InjectRepository } from "@nestjs/typeorm";
import { AttendeeEnity } from "./attendee.entity";
import { Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { CreateAttendeeDto } from "./input/create-attendee.dto";

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(AttendeeEnity)
    private readonly attendeeRepository: Repository<AttendeeEnity>,
  ) { }

  public async findByEventId(eventId: number): Promise<AttendeeEnity[]> {
    return await this.attendeeRepository.find({
      where: { event: { id: eventId } },
    })
  }

  public async findOneByEventIdAndUserId(
    eventId: number, userId: number
  ): Promise<AttendeeEnity | undefined> {
    return await this.attendeeRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId }
      }
    })
  }

  public async createOrUpdate(
    input: CreateAttendeeDto, eventId: number, userId: number
  ): Promise<AttendeeEnity> {
    const attendee = await this.findOneByEventIdAndUserId(eventId, userId) ?? new AttendeeEnity();

    attendee.userId = userId;
    attendee.eventId = eventId;
    attendee.answer = input.answer;
    return await this.attendeeRepository.save(attendee);
  }
}