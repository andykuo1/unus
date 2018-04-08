import EventHandler from 'util/EventHandler.js';

class MessageSystem extends EventHandler
{
  constructor()
  {
    super();
    this.registeredEvents = [];
    this.queuedEvents = [];
  }

  onEventProcessed(eventName, args)
  {
    super.onEventProcessed(eventName, args);
    if (this.registeredEvents.includes(eventName))
    {
      this.queuedEvents.push({ name: eventName, args: args });
    }
  }
}
