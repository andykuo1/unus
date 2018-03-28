import { vec3 } from 'gl-matrix';
import PriorityQueue from 'util/PriorityQueue.js';
import Mouse from 'client/input/Mouse.js';
import Renderer from 'client/Renderer.js';
import ViewPort from 'client/camera/ViewPort.js';

import Application from 'Application.js';

import GameWorld from 'test/GameWorld.js';
import World from 'test/World.js';
import LocalPlayer from 'test/LocalPlayer.js';

class ClientGame
{
  constructor(canvas)
  {
    this.world = new World();
    this.inputStates = new PriorityQueue((a, b) => {
      return a.ticks - b.ticks;
    });

    this.renderer = new Renderer(canvas);
    this.input = new Mouse(document);

    this.thePlayer = null;
  }

  async load()
  {
    console.log("Loading client...");
    await this.renderer.load();
    GameWorld.init(this);

    await this.connect();
  }

  async connect()
  {
    console.log("Connecting client...");
    Application.network.events.on('serverConnect', (server, data) => {
      //Setup the world from state...
      const gameState = data['initialState'];
      this.world.loadState(gameState);

      //Get this client player...
      const playerEntity = this.world.entityManager.getEntityByID(data.playerID);
      if (playerEntity == null) throw new Error("cannot find player with id \'" + data.playerID + "\'");
      this.thePlayer = new LocalPlayer(playerEntity, data.clientID, this.renderer.camera);
      //TODO: this.thePlayer.loadFromGameState(gameState);

      //Listening to the server...
      server.on('server.gamestate', (data) => {
        this.onServerUpdate(server, data);
      });
    });

    await Application.network.initClient();
  }

  update(delta)
  {
    //CLIENT stores CURRENT_INPUT_STATE.
    const currentInputState = this.getCurrentInputState();
    if (currentInputState != null)
    {
      this.inputStates.queue(currentInputState);
      //CLIENT sends CURRENT_INPUT_STATE.
      this.sendClientInput(currentInputState);

      this.thePlayer.onInputUpdate(currentInputState);
    }

    //CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
    this.thePlayer.onUpdate(delta);
    this.world.update(delta);
    this.renderer.render(this.world);
  }

  onServerUpdate(server, gameState)
  {
    //CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
    this.world.resetState(gameState);
    this.thePlayer.readFromGameState(gameState);

    //CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
    while(this.inputStates.length > 0 && this.world.ticks >= this.inputStates.peek().ticks)
    {
      this.inputStates.dequeue();
    }

    const oldInputStates = [];

    //CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.inputStates.dequeue();

      //Update world to just before input...
      const dt = inputState.ticks - this.world.ticks;
      if (dt > 0)
      {
        this.thePlayer.onUpdate(dt);
      }

      //Update world to after this input state...
      this.thePlayer.onInputUpdate(inputState);
      oldInputStates.push(inputState);
    }
    //Re-add all future inputs...
    for(const state of oldInputStates)
    {
      this.inputStates.queue(state);
    }
  }

  getCurrentInputState()
  {
    if (!this.input.isDirty()) return null;
    const inputState = this.input.poll();

    const vec = ViewPort.getPointFromScreen(
      vec3.create(),
      this.renderer.camera, this.renderer.viewport,
      inputState.x, inputState.y);
    inputState.x = vec[0];
    inputState.y = vec[1];
    inputState.ticks = this.world.ticks;
    return inputState;
  }

  sendClientInput(inputState)
  {
    //FIXME: Force 200ms lag...
    setTimeout(() => Application.network.sendToServer('client.inputstate', inputState), 200);
    //Application.network.sendToServer('client.inputstate', inputState);
  }
}

export default ClientGame;
