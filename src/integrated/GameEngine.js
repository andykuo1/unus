import EventHandler from 'util/EventHandler.js';

//EVENT: playerJoined(entityPlayer) - called after a player joins (ServerEngine)
//EVENT: playerLeft(entityPlayer) - called before a player leaves (ServerEngine)

class GameEngine
{
  constructor(world)
  {
    this.events = new EventHandler();
    this.events.onEventProcessed = this.onEventProcessed.bind(this);

    this.synchronizedEvents = [];
    this.cachedEvents = [];

    this.worldTicks = 0;
    this.world = world;
  }

  async start()
  {

  }

  update(frame)
  {
    this.worldTicks = this.world.ticks;
  }

  processInput(clientState, targetEntity)
  {
    this.world.updateInput(clientState, targetEntity);
  }

  handleMessage(message)
  {
    this.events.emit('message', message);
  }

  step(isReenact, t, dt, physicsOnly)
  {
    if (physicsOnly)
    {
      //Update physics with dt
      return;
    }

    const tick = ++this.worldTicks;
    //TODO: Make sure to ignore physics for predicted entities

    //Update physics with dt
    this.world.step(dt);
  }

  onEventProcessed(eventName, args)
  {
    if (this.synchronizedEvents.includes(eventName))
    {
      this.cachedEvents.push({ name: eventName, args: args });
    }
  }
}

export default GameEngine;
