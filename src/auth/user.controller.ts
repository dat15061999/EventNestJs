import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create.user";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  @Post()
  async create(@Body() creatUserDto: CreateUserDto) {
    const user = new User();

    if (creatUserDto.password !== creatUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords are not identical']);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: creatUserDto.username },
        { email: creatUserDto.email },
      ]
    })

    if (existingUser) {
      throw new BadRequestException(['Username or Email are already exist']);
    }

    user.username = creatUserDto.username;
    user.password = creatUserDto.password;
    user.email = creatUserDto.email;
    user.firstname = creatUserDto.firstname;
    user.lastname = creatUserDto.lastname;

    return {
      ...await this.userRepository.save(user),
      token: this.authService.getTokenForuser(user),
    }
  }
}