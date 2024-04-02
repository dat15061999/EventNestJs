import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityEvent } from "./input/event.enity";

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected
}


@Entity({ name: 'attendee' })
export class AttendeeEnity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => EntityEvent, (event) => event.attendees, {
    nullable: false
  })
  @JoinColumn()
  event: EntityEvent;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted
  })
  answer: AttendeeAnswerEnum
}