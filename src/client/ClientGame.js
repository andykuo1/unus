import Frame from '../util/Frame.js';

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
    this.worldTicks = 0;
    this.nextWorldTicks = 0;
    this.prevGameState = null;
    this.input = new Mouse(document);
    this.inputStates = [];
    this.skippedFrames = 0;
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
      this.worldTicks = this.nextWorldTicks = data.worldTicks;

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
      this.inputStates.push(currentInputState);
    }
    else
    {
      this.skippedFrames += frame.delta;
    }
    var targetEntity = currentInputState ? this.playerController.getClientPlayer() : null;

    //CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
    this.world.step(frame, currentInputState, targetEntity);
    this.nextWorldTicks += frame.delta;
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
    console.log("Got server state...");
    console.log("Resetting from " + this.nextWorldTicks + " to " + gameState.worldTicks);
    console.log("That is about " + (this.nextWorldTicks - gameState.worldTicks) + " ticks...");
    this.world.resetState(gameState);
    this.worldTicks = this.nextWorldTicks = gameState.worldTicks;
    console.log("State has been authorized to " + this.worldTicks + "...");

    //CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
    var is = null;
    while(this.inputStates.length > 0 && this.worldTicks >= this.inputStates[0].worldTicks)
    {
      console.log("Found old input state from " + this.inputStates[0].worldTicks);
      is = this.inputStates.shift();
    }

    if (is != null) console.log("The last input state: " + is.worldTicks);

    if (this.inputStates.length <= 0) console.log("no new inputs, this is awkward.");
    else console.log("Found new input states from " + this.inputStates[0].worldTicks);

    //CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
    const targetEntity = this.playerController.getClientPlayer();
    for(const inputState of this.inputStates)
    {
      this.world.step(inputState.frame, inputState, targetEntity);
      this.nextWorldTicks = inputState.worldTicks;
    }

    console.log("This is now the present predicted state at " + this.nextWorldTicks);
    console.log("==END==");
    console.log("");
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
    inputState.worldTicks = this.nextWorldTicks + frame.delta;
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
