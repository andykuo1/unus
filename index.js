var express = require('express');
var path = require('path');

var app = express();

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
var server = app.listen(process.env.PORT || 8082, function() {
  var port = server.address().port;
  console.log("Server is listening on port " + port + "...");
});

var io = require('socket.io')(server);

//Server
require('./server/server-game.js')(io);
