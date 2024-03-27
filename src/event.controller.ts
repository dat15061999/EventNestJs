import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateDTO } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { EntityEvent } from './event.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Controller('/events')
export class ControllerEvent {
  constructor(
    @InjectRepository(EntityEvent)
    private readonly repository: Repository<EntityEvent>
  ) { }


  @Get()
  getAll() { return this.repository.find(); };


  @Get('/:id')
  getOne(@Param('id') id) {
    const event = this.repository.findOne(id);
    return event;
  };


  @Post()
  async createEvent(@Body() input: CreateDTO) {
    return await this.repository.save({
      ...input,
    })
  };


  @Patch('/:id')
  async updateEvent(@Param('id') id, @Body() input: UpdateEventDto) {
    const index = await this.repository.findOne(id);
    return await this.repository.save({
      ...index,
      ...input,
    });
  };


  @Delete('/:id')
  @HttpCode(204)
  async deleteEvent(@Param('id') id) {
    const event = await this.repository.findOne(id);
    await this.repository.remove(event);
  };

  @Get('/practice')
  practive() {
    // return this.repository.find({

    //   where: {
    //     id: MoreThan(2)
    //   },


    // })

    return this.repository.find();
  }
}