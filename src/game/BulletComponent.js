function Bullet()
{
  this.owner = null;
  this.life = 3;
  this.speedx = 0;
  this.speedy = 0;
}

Bullet.sync = {
  owner: { type: 'entity' },
  life: { type: 'integer' },
  speedx: { type: 'float' },
  speedy: { type: 'float' }
};

export default Bullet;
