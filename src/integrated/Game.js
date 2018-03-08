class Game
{
  constructor(networkHandler)
  {
    this.networkHandler = networkHandler;
  }

  load(callback)
  {
    throw new Error("must be overriden");
  }

  connect(callback)
  {
    throw new Error("must be overriden");
  }

  update(frame)
  {
    throw new Error("must be overriden");
  }
}

export default Game;
