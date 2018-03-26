import PriorityQueue from 'util/PriorityQueue.js';
import World from 'integrated/World.js';

class Game
{
  constructor(networkHandler, remote=true)
  {
    this.networkHandler = networkHandler;

    this.world = new World(this.networkHandler.remote);
    this.inputStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
  }

  async load()
  {
  }

  async connect()
  {
  }

  update(frame)
  {
    throw new Error("must be overriden");
  }

  isRemote()
  {
    return this.networkHandler.remote;
  }
}

export default Game;
