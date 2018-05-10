import Application from 'Application.js';

function Motion()
{
  this.motionX = 0;
  this.motionY = 0;
  this.friction = 0.8;

  if (Application.isRemote())
  {
    this.nextMotionX = 0;
    this.prevMotionX = 0;
    this.nextMotionY = 0;
    this.prevMotionY = 0;
  }
}

Motion.sync = {
  motionX: { type: 'float', blend: {
    mode: 'interpolate',
    next: 'nextMotionX',
    prev: 'prevMotionX'
  }},
  motionY: { type: 'float', blend: {
    mode: 'interpolate',
    next: 'nextMotionY',
    prev: 'prevMotionY'
  }},
  friction: { type: 'float' }
};

export default Motion;
