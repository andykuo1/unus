import socketio from 'socket.io';
import express from 'express';
import path from 'path';

import Application from './Application.js';
import NetworkHandler from 'integrated/NetworkHandler.js';
import ServerGame from 'server/ServerGame.js';

const __dirname = path.resolve();
const DEVMODE = process.argv.indexOf('--dev') != -1;
const TIMESTEP = 1000/10;
const PORT = process.env.PORT || 8082;

//Server Setup
const app = express();
app.set('port', PORT);
app.use('/', express.static(__dirname + '/public'));
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/gl-matrix/gl-matrix.js', function(request, response) {
  response.sendFile(path.join(__dirname, 'node_modules/gl-matrix/dist/gl-matrix.js'));
});
const server = app.listen(PORT, function() {
  const port = server.address().port;
  console.log("Server is listening on port " + port + "...");
});

//Application Setup
function start()
{
	const socket = socketio(server);
	const network = new NetworkHandler(socket, false);
	const game = new ServerGame(network);
	Application.init(network, game);
	game.load()
		.then(() => game.connect())
		.then(() => setInterval(onInterval, TIMESTEP));
}

function onInterval()
{
  Application.update();
}

//Start the server...
start();
