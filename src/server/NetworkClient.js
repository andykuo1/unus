class NetworkClient
{
  constructor(socket)
  {
    this._socket = socket;
    this._player = null;
  }

  onConnect()
  {
    console.log("Client connected: " + this._socket.id);
  }

  onDisconnect()
  {
    console.log("Client disconnected: " + this._socket.id);
  }
}

export default NetworkClient;
