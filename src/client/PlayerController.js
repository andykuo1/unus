class PlayerController
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    this.clientPlayer = null;
  }

  setClientPlayer(entity)
  {
    this.clientPlayer = entity;
  }

  getClientPlayer()
  {
    return this.clientPlayer;
  }
}

export default PlayerController;
