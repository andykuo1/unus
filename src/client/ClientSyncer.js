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

    this.currentInput = null;
    this.inputStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
    this.playerController = new PlayerController(this.world.entityManager, renderer);
  }

  init()
  {
    Application.events.on('serverData', this.onServerData.bind(this));
    Application.events.on('inputUpdate', this.onInputUpdate.bind(this));
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

  onInputUpdate(inputState)
  {
    const vec = ViewPort.getPointFromScreen(
      vec3.create(),
      this.renderer.camera, this.renderer.viewport,
      inputState.x, inputState.y);
    inputState.x = vec[0];
    inputState.y = vec[1];
    inputState.worldTicks = this.world.ticks;
    this.currentInput = inputState;
  }

  onUpdate(frame)
  {
    //CLIENT stores CURRENT_INPUT_STATE.
    var currentInputState = this.currentInput;
    this.currentInput = null;
    if (currentInputState != null)
    {
      //HACK: this should always be called, or else desync happens...
      this.inputStates.queue(currentInputState);

      //CLIENT sends CURRENT_INPUT_STATE.
      const data = currentInputState;
      Application.events.emit('clientResponse', data);
      //FIXME: Force 200ms lag...
      setTimeout(() => Application.network.sendToServer('clientData', data), 200);
      //Application.network.sendToServer('clientData', data);
    }
    var targetEntity = currentInputState ? this.playerController.getClientPlayer() : null;

    //CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
    if (targetEntity) this.world.updateInput(currentInputState, targetEntity, true);
    this.world.step(frame, true);

    this.playerController.onUpdate(frame);
  }

  onServerData(server, gameState)
  {
    //CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
    const currentTicks = this.world.ticks;
    this.world.resetState(gameState);

    //CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
    while(this.inputStates.length > 0 && this.world.ticks >= this.inputStates.peek().worldTicks)
    {
      this.inputStates.dequeue();
    }

    const oldInputStates = [];
    const nextFrame = new Frame();

    //CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.inputStates.dequeue();
      const targetEntity = this.playerController.getClientPlayer();

      //Update world to just before input...
      const dt = inputState.worldTicks - this.world.ticks;
      if (dt > 0)
      {
        nextFrame.delta = dt;
        this.world.step(nextFrame, true);
      }

      //Update world to after this input state...
      this.world.updateInput(inputState, targetEntity, true);
      inputState.worldTicks = this.world.ticks;

      oldInputStates.push(inputState);
    }
    //Re-add all future inputs...
    for(const state of oldInputStates)
    {
      this.inputStates.queue(state);
    }

    //Update world to current tick...
    const dt = currentTicks - this.world.ticks;
    if (dt > 0)
    {
      nextFrame.delta = dt;
      this.world.step(nextFrame, true);
    }

    Application.events.emit('serverUpdate', server, gameState);
  }
}

export default ClientSyncer;
