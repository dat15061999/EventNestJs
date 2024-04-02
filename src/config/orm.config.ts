import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Profile } from "src/auth/profile.entity";
import { User } from "src/auth/user.entity";
import { AttendeeEnity } from "src/event/attendee.entity";
import { EntityEvent } from "src/event/input/event.enity";
import { Teacher } from "src/school/teacher.entity";
import { Subject } from "src/school/subject.entity";

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