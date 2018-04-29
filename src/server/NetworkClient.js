class NetworkClient
{
  constructor(socket)
  {
    this._socket = socket;
    this._player = null;
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
  }

  onDisconnect()
  {
    console.log("Disconnecting client: " + this._socket.id);
  }

  get player()
  {
    return this._player;
  }
}

export default NetworkClient;
