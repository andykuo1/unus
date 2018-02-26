class PacketHandler
{
  constructor()
  {
  }

  static sendToServer(id, data, server)
  {
    server.emit(id, data);
  }

  static sendToClient(id, data, client)
  {
    client.emit(id, data);
  }

  static sendToAll(id, data, clients)
  {
    clients.forEach((value, key) => {
      PacketHandler.sendToClient(id, data, value);
    });
  }
}

export default PacketHandler;
