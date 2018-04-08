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

    Application.network.events.on('handshakeResponse', this.onHandshakeResponse.bind(this));
  }

  onHandshakeResponse(client, data)
  {
    //Send previous game state...
    const gameState = this.world.captureState();
    data.gameState = gameState;
  }
}

export default ServerSynchronizer;
