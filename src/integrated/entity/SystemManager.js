class SystemManager
{
  constructor()
  {
    this.systems = [];
  }

  update(entityManager, frame, predictive)
  {
    if (predictive) frame.predictive = predictive;
    for(const system of this.systems)
    {
      system.onUpdate(entityManager, frame);
    }
  }

  updateInput(inputState, targetEntity, predictive)
  {
    if (predictive) inputState.predictive = predictive;
    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }

  captureSystemStates(entityManager, dst)
  {
    for(const system of this.systems)
    {
      system.writeToGameState(entityManager, dst);
    }
  }

  resetSystemStates(entityManager, gameState)
  {
    for(const system of this.systems)
    {
      system.readFromGameState(entityManager, gameState);
    }
  }
}

export default SystemManager;
