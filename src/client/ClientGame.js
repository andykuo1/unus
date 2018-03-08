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

    this.world = new World({delta: 0, then: Date.now(), count: 0}, true);
    this.input = new Mouse(document);
    this.inputStates = [];
    this.renderer = new Renderer(canvas);

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
    if (currentInputState != null) this.inputStates.push(currentInputState);
    var targetEntity = currentInputState ? this.playerController.getClientPlayer() : null;

    //CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
    this.world.step(frame, currentInputState, targetEntity);
    this.renderer.render(this.world);

    //CLIENT sends CURRENT_INPUT_STATE.
    if (currentInputState != null)
    {
      this.sendClientInput(currentInputState);
    }
  }

  onServerUpdate(server, gameState)
  {
    //CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
    this.world.resetState(gameState);
    //CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
    while(this.inputStates.length > 0 && this.world.isNewerThan(this.inputStates[this.inputStates.length - 1].frame))
    {
      this.inputStates.shift();
    }
    //CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
    const targetEntity = this.playerController.getClientPlayer();
    for(const inputState of this.inputStates)
    {
      this.world.step(inputState.frame, inputState, targetEntity);
    }
  }

  getCurrentInputState(frame)
  {
    if (!this.input.isDirty()) return null;
    const inputState = this.input.poll();

    const vec = ViewPort.getPointFromScreen(vec3.create(),
      this.renderer.camera, this.renderer.viewport,
      inputState.x, inputState.y);
    inputState.x = vec[0];
    inputState.y = vec[1];
    inputState.frame = frame;
    return inputState;
  }

  sendClientInput(inputState)
  {
    //FIXME: Force 200ms lag...
    setTimeout(() => this.networkHandler.sendToServer('client.inputstate', inputState), 200);
  }
}

export default ClientGame;
