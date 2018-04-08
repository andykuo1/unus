class SystemManager
{
  constructor()
  {
    this.systems = [];
  }

  update(entityManager, frame, predictive)
  {
    for(const system of this.systems)
    {
      system.onUpdate(entityManager, frame.delta);
    }
  }

  updateInput(inputState, targetEntity, predictive)
  {
    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }
}

export default SystemManager;
