const ENABLE_SIMULATED_LATENCY = true;
const AVERAGE_SIMULATED_LATENCY = 200;
const AVERAGE_SIMULATED_JITTER = 50;

class NetworkHandler
{
  sendTo(socket, packetID, packetData)
  {
    if (!socket) throw new Error("Cannot send to unknown socket");

    if (ENABLE_SIMULATED_LATENCY)
    {
      setTimeout(() => socket.emit(packetID, packetData),
        AVERAGE_SIMULATED_LATENCY + AVERAGE_SIMULATED_JITTER * Math.random());
    }
    else
    {
      socket.emit(packetID, packetData);
    }
  }
}

export default NetworkHandler;
