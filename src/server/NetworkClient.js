class NetworkClient
{
  constructor(socket)
  {
    this._socket = socket;
    this._player = null;

    this.targetX = 0;
    this.targetY = 0;
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
      this._player.Transform.position[0] = this.targetX;
      this._player.Transform.position[1] = this.targetY;
    }
  }

  onClientInput(data)
  {
    this.targetX = data.targetX;
    this.targetY = data.targetY;
  }

  get player()
  {
    return this._player;
  }
}

export default NetworkClient;
