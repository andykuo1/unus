import Application from 'Application.js';
import Frame from 'util/Frame.js';
import PriorityQueue from 'util/PriorityQueue.js';
import PlayerManager from 'server/PlayerManager.js';

class ServerSynchronizer
{
  constructor(world)
  {
    this.world = world;
    this.clientStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
    this.playerManager = new PlayerManager(this.world.entityManager);

    Application.events.on('clientData', this.onClientData.bind(this));
    //Application.events.on('update', this.onUpdate.bind(this));//DOES NOT HAVE FRAME OBJ YET
  }

  init()
  {
    Application.network.events.on('clientConnect', this.onClientConnect.bind(this));
    Application.network.events.on('handshakeResponse', this.onHandshakeResponse.bind(this));
    Application.network.events.on('clientDisconnect', this.onClientDisconnect.bind(this));
  }

  onClientConnect(client)
  {
    this.playerManager.createPlayer(client.id);
  }

  onHandshakeResponse(client, data)
  {
    //Insert new player...
    const clientEntity = this.playerManager.getPlayerByClientID(client.id);
    data.entityID = clientEntity._id;

    //Send previous game state...
    const gameState = this.world.captureState();
    data.gameState = gameState;
  }

  onClientDisconnect(client)
  {
    this.playerManager.destroyPlayer(client.id);
  }

  onUpdate(frame)
  {
    const currentTicks = this.world.ticks + frame.delta;
    const nextFrame = new Frame();

    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.clientStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.clientStates.dequeue();
      const targetEntity = this.playerManager.getPlayerByClientID(inputState.target);

      //Update world to just before input...
      const dt = inputState.worldTicks - this.world.ticks;
      if (dt > 0)
      {
        nextFrame.delta = dt;
        this.world.step(nextFrame);
      }

      //Update world to after this input state...
      if (targetEntity) this.world.updateInput(inputState, targetEntity);
    }

    //Update world to current tick...
    const dt = currentTicks - this.world.ticks;
    if (dt > 0)
    {
      nextFrame.delta = dt;
      this.world.step(nextFrame);
    }
    
    this.playerManager.onUpdate(frame);
  }

  onClientData(client, data)
  {
    //SERVER stores CURRENT_INPUT_STATE.
    data.target = client.id;
    this.clientStates.queue(data);
  }
}

export default ServerSynchronizer;
