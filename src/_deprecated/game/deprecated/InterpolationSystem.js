import Application from 'Application.js';

class InterpolationSystem
{
  constructor(world)
  {
    this.world = world;
    this.states = [];

    this.interpolationTime = 0;
    this.delayTime = 200;

    Application.events.on('serverResponse', this.onServerResponse.bind(this));
    Application.events.on('serverData', this.onServerData.bind(this));
  }

  //server side
  onServerResponse(data)
  {
    const worldState = this.world.entitySystem.serialize();
    worldState.ticks = this.ticks;
    data.worldState = worldState;
    this.states.push(worldState);
  }

  //client side
  onServerData(data)
  {
    const worldState = data.worldState;
    const worldTicks = worldState.ticks;
    this.states.push(worldState);
  }

  onServerUpdate(delta)
  {
    this.world.step(delta);
  }

  onClientUpdate(delta)
  {
    this.interpolationTime += delta;
    this.world.step(delta);
  }
}

export default InterpolationSystem;
