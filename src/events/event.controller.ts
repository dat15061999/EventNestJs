import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateDTO } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { EntityEvent } from './event.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const event = this.repository.findOne({ where: { id: id }, });
    return event;
  };


  @Post()
  async createEvent(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateDTO
  ) {
    return await this.repository.save({
      ...input,
    })
  };


  @Patch('/:id')
  async updateEvent(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'], transform: true })) input: UpdateEventDto) {
    const index = await this.repository.findOne({ where: { id: id }, });
    return await this.repository.save({
      ...index,
      ...input,
    });
  };


  @Delete('/:id')
  @HttpCode(204)
  async deleteEvent(@Param('id') id) {
    const event = await this.repository.findOne({ where: { id: id }, });
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