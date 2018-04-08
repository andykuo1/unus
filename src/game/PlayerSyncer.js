import Application from 'Application.js';
import PlayerManager from 'server/PlayerManager.js';
import Frame from 'util/Frame.js';
import PriorityQueue from 'util/PriorityQueue.js';

class PlayerSyncer
{
  constructor(world)
  {
    this.world = world;

    this.clientStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
    this.playerManager = new PlayerManager(this.world.entityManager);
  }

  init()
  {
    if (!Application.isRemote())
    {
      //Application.events.on('update', this.onServerUpdate.bind(this));
      Application.network.events.on('clientConnect', this.onClientConnect.bind(this));
      Application.network.events.on('handshakeResponse', this.onHandshakeResponse.bind(this));
      Application.network.events.on('clientDisconnect', this.onClientDisconnect.bind(this));
    }
    else
    {
      //Application.events.on('serverData', this.onServerData.bind(this));
    }
  }

  //Server side
  onClientConnect(client)
  {
    this.playerManager.createPlayer(client.id);
  }

  //Server side
  onHandshakeResponse(client, data)
  {
    const clientEntity = this.playerManager.getPlayerByClientID(client.id);
    data.entityID = clientEntity._id;
  }

  //Server side
  onClientDisconnect(client)
  {
    this.playerManager.destroyPlayer(client.id);
  }
}

export default PlayerSyncer;
