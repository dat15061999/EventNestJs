import { Length } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AttendeeEnity } from "../attendee.entity";
import { User } from "src/auth/user.entity";
import { Expose } from "class-transformer";


@Entity("event")
export class EntityEvent {
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