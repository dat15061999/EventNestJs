import { EntityEvent } from "./input/event.enity"

test('Event should be initialized throurhg constuctor', () => {
  const event = new EntityEvent({
    name: "Interesting event",
    description: 'That was fun'
  })

  expect(event).toEqual({
    name: "Interesting event",
    description: 'That was fun',
    id: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
  })

})