import Application from 'Application.js';
import Frame from 'util/Frame.js';
import PriorityQueue from 'util/PriorityQueue.js';

class ServerSynchronizer
{
  constructor(world)
  {
    this.world = world;
  }

  init()
  {
    Application.network.events.on('handshakeResponse', this.onHandshakeResponse.bind(this));
  }

  onHandshakeResponse(client, data)
  {
    const clientEntity = Application.game.getPlayerByClientID(client.id);
    data.entityID = clientEntity._id;

    //Send previous game state...
    const gameState = this.world.captureState();
    data.gameState = gameState;
  }
}

export default ServerSynchronizer;
