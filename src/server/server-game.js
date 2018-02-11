import './console.js';

function run(io)
{
  console.log("Loading Server...");

  io.on('connection', function(socket){
    console.log("Connection established!");

    socket.on('echo', function(data){
      console.log("Received echo: " + data.value);
    });

    socket.on('disconnect', function() {
      console.log("Connection lost!");
    });
  });
}

export default run;
