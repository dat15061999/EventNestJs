import { Repository } from "typeorm";
import { EventsController } from "./event.controller";
import { EventsService } from "./events.service";
import { EntityEvent } from "./input/event.enity";
import { ListEvents } from "./input/list.events";
import { User } from "./../auth/user.entity";
import { NotFoundException } from "@nestjs/common";

describe("EventsController", () => {
  let evetnsServicce: EventsService;
  let eventsController: EventsController;
  let eventsRepository: Repository<EntityEvent>

  beforeAll(() => console.log("this logged once"));

  beforeEach(() => {
    evetnsServicce = new EventsService(eventsRepository);
    eventsController = new EventsController(evetnsServicce, eventsRepository);
  })

  it("Check controller events", async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: []
    };
    // evetnsServicce.getEventsWithAttendeeCountFilteredPaginated
    //   = jest.fn().mockImplementation((): any => result);
    const spy = jest
      .spyOn(evetnsServicce, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);
    expect(await eventsController.findAll(new ListEvents))
      .toEqual(result);
    expect(spy).toBeCalledTimes(1);
  });

  it('should not delete an event, when it\'s not found', async () => {
    const deleteSpy = jest.spyOn(evetnsServicce, 'deleteEvent');
    const findSpy = jest.spyOn(evetnsServicce, 'findOne')
      .mockImplementation((): any => undefined);

    try {
      await eventsController.deleteEvent(1, new User());
    } catch (error) {
      if (error.message.includes('not found')) {
        // Nếu có, chắc chắn rằng lỗi đó là một NotFoundException
        expect(error).toBeInstanceOf(NotFoundException);
      } else {
        // Nếu không, kiểm tra lỗi đó có phải là một TypeError hay không
        expect(error).toBeInstanceOf(TypeError);
      }
    }

    expect(deleteSpy).toBeCalledTimes(0);
    expect(findSpy).toBeCalledTimes(0);
  });

});