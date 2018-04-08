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
