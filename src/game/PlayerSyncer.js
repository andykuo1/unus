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
      Application.events.on('update', this.onServerUpdate.bind(this));
      Application.events.on('clientData', this.onClientData.bind(this));
      Application.network.events.on('clientConnect', this.onClientConnect.bind(this));
      Application.network.events.on('handshakeResponse', this.onHandshakeResponse.bind(this));
      Application.network.events.on('clientDisconnect', this.onClientDisconnect.bind(this));
    }
    else
    {
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

  //Server side
  onUpdateClientState(targetEntity, clientState)
  {
    //Update world to after this input state...
    if (targetEntity) this.world.updateInput(clientState, targetEntity);
  }

  //Server side
  onServerUpdate(delta)
  {
    const currentTicks = this.world.ticks + delta;
    const nextFrame = new Frame();

    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.clientStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const clientState = this.clientStates.dequeue();
      const targetEntity = this.playerManager.getPlayerByClientID(clientState.target);

      //Step the world here?

      this.onUpdateClientState(targetEntity, clientState);
    }

    //this.playerManager.onUpdate(delta); <- that needs to be frame...
  }

  //Server side
  onClientData(client, data)
  {
    //SERVER stores CURRENT_INPUT_STATE.
    data.target = client.id;
    this.clientStates.queue(data);
  }
}

export default PlayerSyncer;
