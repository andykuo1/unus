const express = require('express');
const path = require('path');

const app = express();

app.set('port', 8082);
app.use('/public', express.static(__dirname + '/public'));

//Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/gl-matrix/gl-matrix.js', function(request, response) {
  response.sendFile(path.join(__dirname, 'node_modules/gl-matrix/dist/gl-matrix.js'));
});

//Listening
const server = app.listen(process.env.PORT || 8082, function() {
  var port = server.address().port;
  console.log("Server is listening on port " + port + "...");
});

//Console
require('./server/console.js');

//Server
const io = require('socket.io')(server);
require('./server/server-game.js')(io);
