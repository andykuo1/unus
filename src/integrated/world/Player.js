class Player
{
  constructor()
  {
    this.position = vec3.create();
    this.motionX = 0;
    this.motionY = 0;
  }

  onInputUpdate(inputState)
  {
    //TODO: change position base on inputSTate
  }

  onUpdate()
  {
    this.position[0] += this.motionX;
    this.position[1] += this.motionY;
    this.motionX *= 0.6;
    this.motionY *= 0.6;
  }
}

export default Player;
