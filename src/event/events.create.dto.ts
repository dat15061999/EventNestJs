import { Length } from "class-validator";

export class CreateDTO {
  @Length(5, 225, { message: "Name is invalid" })
  name: string;

  @Length(5, 225, { message: "Address is invalid" })
  address: string;

  @Length(5, 225, { message: "create description is invalid", groups: ['create'] })
  @Length(10, 225, { message: "update description is invalid", groups: ['update'] })
  description: string;
}