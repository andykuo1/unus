var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.json');

app.use(express.static(__dirname + '/../client'));

io.on('connection', function(socket) {
	console.log("Connection Established!");

	//Something happens.
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
	console.log("Listening on port " + serverPort + "...");
});
