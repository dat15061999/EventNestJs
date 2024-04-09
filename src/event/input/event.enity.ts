import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AttendeeEnity } from "../attendee.entity";
import { User } from "./../../auth/user.entity";
import { Expose } from "class-transformer";
import { PaginationResult } from "./../../pagination/paginator";


@Entity("event")
export class EntityEvent {
  constructor(partial?: Partial<EntityEvent>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  address: string;

  @Column()
  @Expose()

  description: string;

  @OneToMany(() => AttendeeEnity, (attendee) => attendee.event, {
    cascade: true,
  })
  @Expose()
  attendees: AttendeeEnity[]; //

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizedId' })
  @Expose()
  organizer: User

  @Column({ nullable: true })
  @Expose()
  organizedId: number;


  @Expose()
  attendeeCount?: number;

  @Expose()
  attendeeRejected?: number; ///

  @Expose()
  attendeeMaybe?: number;

  @Expose()
  attendeeAccepted?: number;
}

export type PaginatedEvents = PaginationResult<EntityEvent>;