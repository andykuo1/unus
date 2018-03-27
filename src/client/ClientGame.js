import { vec3 } from 'gl-matrix';

import Frame from 'util/Frame.js';

import Game from 'integrated/Game.js';
import PlayerController from 'client/PlayerController.js';

import Mouse from 'client/input/Mouse.js';
import Renderer from 'client/Renderer.js';
import ViewPort from 'client/camera/ViewPort.js';

import GameFactory from 'game/GameFactory.js';

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
  constructor(networkHandler, canvas)
  {
    super(networkHandler);

    this.renderer = new Renderer(canvas);

    this.input = new Mouse(document);
    this.playerController = new PlayerController(this.world.entityManager, this.renderer);
  }

  async load()
  {
    console.log("Loading client...");
    await this.renderer.load();
    await this.connect();
  }

  async connect()
  {
    console.log("Connecting client...");
    this.networkHandler.events.on('serverConnect', (server, data) => {
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
    });

    await this.networkHandler.initClient();
  }

  update(frame)
  {
    this.onUpdate(frame);
    this.playerController.onUpdate(frame);
  }

  /************* Game Implementation *************/

  onUpdate(frame)
  {
    //CLIENT stores CURRENT_INPUT_STATE.
    var currentInputState = this.getCurrentInputState();
    if (currentInputState != null)
    {
      //HACK: this should always be called, or else desync happens...
      this.inputStates.queue(currentInputState);

      //CLIENT sends CURRENT_INPUT_STATE.
      this.sendClientInput(currentInputState);
    }
    var targetEntity = currentInputState ? this.playerController.getClientPlayer() : null;

    //CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
    GameFactory.GAMESTATE = currentInputState;
    if (targetEntity) this.world.updateInput(currentInputState, targetEntity, true);
    GameFactory.GAMESTATE = null;
    this.world.step(frame, true);
    this.renderer.render(this.world);
  }

  onServerUpdate(server, gameState)
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
      GameFactory.GAMESTATE = inputState;
      this.world.updateInput(inputState, targetEntity, true);
      GameFactory.GAMESTATE = null;
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
  }

  getCurrentInputState()
  {
    //TODO: need to adjust the frame delta to match if skipped input frames
    //TODO: if (!this.input.isDirty()) return null;
    const inputState = this.input.poll();

    const vec = ViewPort.getPointFromScreen(
      vec3.create(),
      this.renderer.camera, this.renderer.viewport,
      inputState.x, inputState.y);
    inputState.x = vec[0];
    inputState.y = vec[1];
    inputState.worldTicks = this.world.ticks;
    return inputState;
  }

  sendClientInput(inputState)
  {
    //FIXME: Force 200ms lag...
    //setTimeout(() => this.networkHandler.sendToServer('client.inputstate', inputState), 200);
    this.networkHandler.sendToServer('client.inputstate', inputState);
  }
}

export default ClientGame;
