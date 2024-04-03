import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @Length(5)
  username: string;
  @Length(6)
  password: string;
  @Length(6)
  retypedPassword: string;
  @Length(5)
  firstname: string;
  @Length(5)
  lastname: string;
  @IsEmail()
  email: string;

}