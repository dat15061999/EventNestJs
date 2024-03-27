
import { PartialType } from '@nestjs/mapped-types'
import { CreateDTO } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateDTO) { }