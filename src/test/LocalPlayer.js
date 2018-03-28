class LocalPlayer
{
  constructor(entity, clientID, camera)
  {
    this.entity = entity;
    this.clientID = clientID;
    this.camera = camera;
  }

  onUpdate(delta)
  {
    if (LocalPlayer.CAMERA_FOLLOW && this.entity)
    {
      const dampingFactor = 0.3;
      const playerTransform = this.entity.transform;
      const cameraTransform = this.camera.transform;
      const dx = playerTransform.x - cameraTransform.position[0];
      const dy = playerTransform.y - cameraTransform.position[1];
      cameraTransform.position[0] += dx * dampingFactor;
      cameraTransform.position[1] += dy * dampingFactor;
    }
  }

  onInputUpdate(inputState)
  {
    this.entity.transform.nextX = inputState.x;
    this.entity.transform.nextY = inputState.y;
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

LocalPlayer.CAMERA_FOLLOW = false;

export default LocalPlayer;
