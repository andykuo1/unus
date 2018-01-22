var express = require('express');
var path = require('path');

var app = express();

app.set('port', 8082);
app.use('/public', express.static(__dirname + '/public'));

//Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

//Listening
var server = app.listen(process.env.PORT || 8082, function() {
  var port = server.address().port;
  console.log("Server is listening on port " + port + "...");
});

var io = require('socket.io')(server);

//Server
require('./server-test.js')(io);
