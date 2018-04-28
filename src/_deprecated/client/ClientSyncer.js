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
    this.cachedInputs = [];
  }

  init()
  {
    Application.events.on('serverData', this.onServerData.bind(this));
    Application.game.gameEngine.events.on('processInput', this.onProcessInput.bind(this));
    Application.game.gameEngine.events.on('lateStep', this.onLateStep.bind(this));
  }

  onProcessInput(clientState, targetEntity)
  {
    if (targetEntity !== this.playerController.getClientPlayer()) return;
    this.cachedInputs.push(clientState);
  }

  onLateStep()
  {
    //Apply incremental bending for all objects?

    //Apply required syncs?
  }

  synchronizeState(state)
  {
    //If object has a local shadow, adopt the server object

    //If object exists locally, sync to server object (will re-enact later)

    //If object is new, create it
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
