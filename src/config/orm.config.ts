import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Profile } from "./../auth/profile.entity";
import { User } from "./../auth/user.entity";
import { AttendeeEnity } from "./../event/attendee.entity";
import { EntityEvent } from "./../event/input/event.enity";
import { Teacher } from "./../school/teacher.entity";
import { Subject } from "./../school/subject.entity";

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [EntityEvent, User, Profile, AttendeeEnity, Subject, Teacher],
    synchronize: true,
  }));