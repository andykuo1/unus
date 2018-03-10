class PlayerController
{
  constructor(entityManager, renderer)
  {
    this.entityManager = entityManager;
    this.renderer = renderer;

    this.clientPlayer = null;
  }

  setClientPlayer(entity)
  {
    this.clientPlayer = entity;
  }

  onUpdate(frame)
  {
    //Smoothly follow the player
    if (this.clientPlayer)
    {
      const dampingFactor = 0.3;
      const playerTransform = this.clientPlayer.transform;
      const cameraTransform = this.renderer.camera.transform;
      const dx = playerTransform.x - cameraTransform.position[0];
      const dy = playerTransform.y - cameraTransform.position[1];
      cameraTransform.position[0] += dx * dampingFactor;
      cameraTransform.position[1] += dy * dampingFactor;
    }
  }

  getClientPlayer()
  {
    return this.clientPlayer;
  }
}

export default PlayerController;
