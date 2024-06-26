import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name)

  constructor(
    @InjectRepository(User)
    private readonly useRepository: Repository<User>
  ) {
    super();
  }

  public async validate(
    username: string, password: string
  ): Promise<any> {
    const user = await this.useRepository.findOne({
      where: { username }
    });

    if (!user) {
      this.logger.debug(`User ${username} not found!`);
      throw new UnauthorizedException();
    }

    if ((await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Password is invalid for user ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}