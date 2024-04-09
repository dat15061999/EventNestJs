import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityEvent } from "./input/event.enity";
import { User } from "./../auth/user.entity";
import { Expose } from "class-transformer";

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected
}

@Entity({ name: 'attendee' })
export class AttendeeEnity {
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => EntityEvent, (event) => event.attendees, {
    nullable: false
  })
  @JoinColumn()
  event: EntityEvent;

  @Column()
  eventId: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted
  })
  @Expose()
  answer: AttendeeAnswerEnum

  @ManyToOne(() => User, (user) => user.attended)
  @Expose()
  user: User;

  @Column()
  userId: number;
}