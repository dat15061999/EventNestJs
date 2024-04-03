import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { EntityEvent } from "src/event/input/event.enity";
import { Expose } from "class-transformer";



@Entity()
export class User {

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  username: string;

  @Column()
  @Expose()

  password: string;

  @Column()
  @Expose()

  email: string;

  @Column()
  @Expose()

  firstname: string;

  @Column()
  @Expose()

  lastname: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()

  profile: Profile;

  @OneToMany(() => EntityEvent, (event) => event.organizer)
  @Expose()

  organized: EntityEvent[];

}