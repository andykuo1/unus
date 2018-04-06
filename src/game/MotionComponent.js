function Motion()
{
  this.motionX = 0;
  this.motionY = 0;
  this.friction = 2;
}

Motion.sync = {
  motionX: { type: 'float' },
  motionY: { type: 'float' },
  friction: { type: 'float' }
};

export default Motion;
