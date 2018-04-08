class SystemManager
{
  constructor()
  {
    this.systems = [];
    this.predictiveEntities = {};
  }

  update(entityManager, frame, predictive)
  {
    this.makePredictiveState(frame, predictive);

    for(const system of this.systems)
    {
      system.onUpdate(entityManager, frame.delta);
    }
  }

  updateInput(inputState, targetEntity, predictive)
  {
    this.makePredictiveState(inputState, predictive);

    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }

  makePredictiveState(state, predictive)
  {
    if (predictive || state.hasOwnProperty('predictive'))
    {
      state.predictiveFirst = (predictive && !state.predictive);
      state.predictive = predictive;
    }

    return state;
  }
}

export default SystemManager;
