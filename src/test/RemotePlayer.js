class RemotePlayer
{
  constructor(entity, clientID)
  {
    this.entity = entity;
    this.clientID = clientID;
  }

  onUpdate(delta)
  {
    
  }

  onInputUpdate(inputState)
  {
    this.entity.transform.x = inputState.x;
    this.entity.transform.y = inputState.y;
  }

  saveToGameState(gameState)
  {
  }

  loadFromGameState(gameState)
  {
  }

  writeToGameState(gameState)
  {

  }

  readFromGameState(gameState)
  {

  }
}

export default RemotePlayer;
