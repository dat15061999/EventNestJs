import { Repository } from "typeorm";
import { EventsService } from "./events.service";
import { EntityEvent } from './input/event.enity';
// import * as paginator from './../pagination/paginator';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing"

// jest.mock('./../pagination/paginator');

describe('Event service', () => {
  let service: EventsService;
  let repository: Repository<EntityEvent>;
  let selectQb: any;
  let deleteQb: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EntityEvent),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          }
        }
      ]
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<EntityEvent>>(
      getRepositoryToken(EntityEvent)
    );
    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    }
    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    }
  });

});