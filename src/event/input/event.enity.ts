import { Length } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AttendeeEnity } from "../attendee.entity";
import { User } from "src/auth/user.entity";


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

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizedId' })
  organizer: User

  @Column({ nullable: true })
  organizedId: number;

  attendees: AttendeeEnity[]; //

  attendeeCount?: number;

  attendeeRejected?: number; ///

  attendeeMaybe?: number;

  attendeeAccepted?: number;
}