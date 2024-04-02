
import { PartialType } from '@nestjs/mapped-types'
import { CreateDTO } from '../events.create.dto';

export class UpdateEventDto extends PartialType(CreateDTO) { }