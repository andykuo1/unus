import Application from 'Application.js';

class MissileSystem
{
  constructor(world)
  {
    this.world = world;
    Application.events.on('update', this.onUpdate.bind(this));
    Application.events.on('fireBullet', this.onBulletFire.bind(this));
  }

  onUpdate(delta)
  {

  }

  onBulletFire(owner, direction)
  {
  }
}

export default MissileSystem;
