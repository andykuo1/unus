import './console.js';

function run(io)
{
  console.log("LOADED!");
  var players = {};
  io.on('connection', function(socket) {
    console.log("User Connected!");
    socket.on('newplayer', function(data) {
      players[socket.id] = {
        x: 300,
        y: 300
      };
    });
    socket.on('movement', function(data) {
      var player = players[socket.id] || {};
      if (data.left) player.x -= 5;
      if (data.up) player.y -= 5;
      if (data.right) player.x += 5;
      if (data.down) player.y += 5;
    });
    socket.on('disconnect', function() {
      console.log("User Disconnected!");
      delete players[socket.id];
    });
  });

  setInterval(function() {
    io.sockets.emit('state', players);
  }, 1000 / 60);
}

export default run;
