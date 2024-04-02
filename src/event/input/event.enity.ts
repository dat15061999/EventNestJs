import { Length } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AttendeeEnity } from "../attendee.entity";


@Entity("event")
export class EntityEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  description: string;

  @OneToMany(() => AttendeeEnity, (attendee) => attendee.event, {
    cascade: true,
  })
  attendees: AttendeeEnity[]; //

  attendeeCount?: number;

  attendeeRejected?: number; ///

  attendeeMaybe?: number;

  attendeeAccepted?: number;
}