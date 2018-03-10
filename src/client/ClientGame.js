import Frame from '../util/Frame.js';
import PriorityQueue from '../util/PriorityQueue.js';

import Game from '../integrated/Game.js';
import World from '../integrated/World.js';
import PlayerController from './PlayerController.js';

import Mouse from './input/Mouse.js';
import Renderer from './Renderer.js';
import ViewPort from './camera/ViewPort.js';

/*
CLIENT gets CURRENT_GAME_STATE.
CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
. . .
CLIENT stores CURRENT_INPUT_STATE.
CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
CLIENT sends CURRENT_INPUT_STATE.
*/

class ClientGame extends Game
{
  constructor(networkHandler)
  {
    super(networkHandler);

    this.world = new World(true);
    this.inputStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
    this.nextInputStates = [];

    this.prevGameState = null;

    this.skippedFrames = 0;
    this.renderer = new Renderer(canvas);

    this.input = new Mouse(document);
    this.playerController = new PlayerController(this.world.entityManager);
  }

  load(callback)
  {
    console.log("Loading client...");
    this.renderer.load(callback);
  }

  connect(callback)
  {
    console.log("Connecting client...");
    this.networkHandler.initClient(callback);
    this.networkHandler.onServerConnect = (server, data) => {
      //Setup the world from state...
      this.world.resetState(data['gameState']);

      //Get this client player...
      const clientEntity = this.world.entityManager.getEntityByID(data.entityID);
      if (clientEntity == null) throw new Error("cannot find player with id \'" + data.entityID + "\'");
      this.playerController.setClientPlayer(clientEntity);

      //Listening to the server...
      server.on('server.gamestate', (data) => {
        this.onServerUpdate(server, data);
      });
    };
  }

  update(frame)
  {
    this.onUpdate(frame);
  }

  /************* Game Implementation *************/

  onUpdate(frame)
  {
    //CLIENT stores CURRENT_INPUT_STATE.
    var currentInputState = this.getCurrentInputState(frame);
    if (currentInputState != null)
    {
      currentInputState.frame.delta += this.skippedFrames;
      this.skippedFrames = 0;

      //HACK: this should always be called, or else desync happens...
      this.inputStates.queue(currentInputState);
    }
    else
    {
      this.skippedFrames += frame.delta;
    }
    var targetEntity = currentInputState ? this.playerController.getClientPlayer() : null;

    //CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
    this.world.step(frame, currentInputState, targetEntity);
    this.world.ticks += frame.delta;
    this.renderer.render(this.world);
    if (this.prevGameState != null)
    {
      this.renderer.renderGameState(this.prevGameState);
    }

    //CLIENT sends CURRENT_INPUT_STATE.
    if (currentInputState != null)
    {
      this.sendClientInput(currentInputState);
    }
  }

  onServerUpdate(server, gameState)
  {
    //CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
    this.prevGameState = this.world.captureState(new Frame());//DEBUG: Just to see what is going on...
    this.prevGameState.entities = Object.values(gameState.entitylist);

    this.world.resetState(gameState);

    //CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
    while(this.inputStates.length > 0 && this.world.ticks >= this.inputStates.peek().worldTicks)
    {
      this.inputStates.dequeue();
    }

    //CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
    const oldInputStates = [];
    const targetEntity = this.playerController.getClientPlayer();
    while(this.inputStates.length > 0)
    {
      const inputState = this.inputStates.dequeue();
      this.world.step(inputState.frame, inputState, targetEntity);
      this.world.ticks = inputState.worldTicks;

      oldInputStates.push(inputState);
    }
    for(const state of oldInputStates)
    {
      this.inputStates.queue(state);
    }
  }

  getCurrentInputState(frame)
  {
    //TODO: need to adjust the frame delta to match if skipped input frames
    //TODO: if (!this.input.isDirty()) return null;
    const inputState = this.input.poll();

    const vec = ViewPort.getPointFromScreen(vec3.create(),
      this.renderer.camera, this.renderer.viewport,
      inputState.x, inputState.y);
    inputState.x = vec[0];
    inputState.y = vec[1];
    inputState.frame = new Frame().set(frame);
    inputState.worldTicks = this.world.ticks + frame.delta;
    return inputState;
  }

  sendClientInput(inputState)
  {
    //FIXME: Force 200ms lag...
    setTimeout(() => this.networkHandler.sendToServer('client.inputstate', inputState), 200);
    //this.networkHandler.sendToServer('client.inputstate', inputState);
  }
}

export default ClientGame;
