import { vec3 } from 'gl-matrix';
import Application from 'Application.js';
import Frame from 'util/Frame.js';
import PriorityQueue from 'util/PriorityQueue.js';
import PlayerController from 'client/PlayerController.js';
import ViewPort from 'client/camera/ViewPort.js';

class ClientSyncer
{
  constructor(world, input, renderer)
  {
    this.world = world;
    this.input = input;
    this.renderer = renderer;

    this.playerController = new PlayerController(this.world.entityManager, renderer);
  }

  init()
  {
    Application.events.on('serverData', this.onServerData.bind(this));
    Application.network.events.on('handshakeResult', this.onHandshakeResult.bind(this));
  }

  onHandshakeResult(server, data)
  {
    //Setup the world from state...
    this.world.resetState(data['gameState']);

    //Get this client player...
    const clientEntity = this.world.entityManager.getEntityByID(data.entityID);
    if (clientEntity == null) throw new Error("cannot find player with id \'" + data.entityID + "\'");
    this.playerController.setClientPlayer(clientEntity);
  }

  onUpdate(frame)
  {
    this.playerController.onUpdate(frame);
  }

  onServerData(server, data)
  {
    const gameState = data.worldState;
    this.world.resetState(gameState);
  }
}

export default ClientSyncer;
