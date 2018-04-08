import Application from 'Application.js';
import Frame from 'util/Frame.js';
import PriorityQueue from 'util/PriorityQueue.js';
import PlayerSyncer from 'game/PlayerSyncer.js';

class ServerSynchronizer
{
  constructor(world)
  {
    this.world = world;
    this.playerSyncer = new PlayerSyncer(this.world);
  }

  init()
  {
    this.playerSyncer.init();

    Application.events.on('update', this.onUpdate.bind(this));
    Application.network.events.on('handshakeResponse', this.onHandshakeResponse.bind(this));
  }

  onHandshakeResponse(client, data)
  {
    //Send previous game state...
    const gameState = this.world.captureState();
    data.gameState = gameState;
  }

  onUpdate(delta)
  {
    const currentTicks = this.world.ticks + delta;
    const nextFrame = new Frame();

    this.playerSyncer.onServerUpdate(delta);

    //Update world to current tick...
    const dt = currentTicks - this.world.ticks;
    if (dt > 0)
    {
      nextFrame.delta = dt;
      this.world.step(nextFrame);
    }
  }
}

export default ServerSynchronizer;
