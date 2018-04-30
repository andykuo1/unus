import * as MathHelper from 'util/MathHelper.js';

class NetworkClient
{
  constructor(socket, world)
  {
    this._world = world;
    this._socket = socket;
    this._player = null;

    this.targetX = 0;
    this.targetY = 0;
    this.speed = 1;
  }

  onPlayerCreate(entityPlayer)
  {
    console.log("Creating player...");

    this._player = entityPlayer;
  }

  onPlayerDestroy()
  {
    console.log("Destroying player...");

    this._player = null;
  }

  onConnect()
  {
    console.log("Connecting client: " + this._socket.id);

    this._socket.on('clientInput', this.onClientInput.bind(this));
  }

  onDisconnect()
  {
    console.log("Disconnecting client: " + this._socket.id);
  }

  onUpdate(delta)
  {
    if (this._player)
    {
      let dx = this.targetX - this._player.Transform.position[0];
      let dy = this.targetY - this._player.Transform.position[1];
      const dist = dx * dx + dy * dy;
      if (dist > 1)
      {
        const angle = Math.atan2(dy, dx);
        this._player.Motion.motionX = Math.cos(angle) * this.speed;
        this._player.Motion.motionY = Math.sin(angle) * this.speed;
      }
    }
  }

  onClientInput(data)
  {
    this.targetX = data.targetX;
    this.targetY = data.targetY;

    if (data.fireBullet)
    {
      const bullet = this._world.entityManager.spawnEntity('bullet');
      bullet.Transform.position[0] = this._player.Transform.position[0];
      bullet.Transform.position[1] = this._player.Transform.position[1];
      bullet.Motion.motionX = this.targetX - this._player.Transform.position[0];
      bullet.Motion.motionY = this.targetY - this._player.Transform.position[1];
      bullet.Motion.friction = 0;
    }
  }

  get player()
  {
    return this._player;
  }
}

export default NetworkClient;
