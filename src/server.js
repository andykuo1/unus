import express from 'express';
import path from 'path'
import socketio from 'socket.io';

import ServerGame from './server/ServerGame.js';

const __dirname = path.resolve();
const DEVMODE = process.argv.indexOf('--dev') != -1;
const FPS = 60;
const PORT = process.env.PORT || 8082;

//Server Setup
var app = express();
app.set('port', PORT);
app.use('/', express.static(__dirname + '/public'));
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/gl-matrix/gl-matrix.js', function(request, response) {
  response.sendFile(path.join(__dirname, 'node_modules/gl-matrix/dist/gl-matrix.js'));
});
var server = app.listen(PORT, function() {
  let port = server.address().port;
  console.log("Server is listening on port " + port + "...");
});

//Application setup
var io = socketio(server);
var game;
function start()
{
  game = new ServerGame(io);
  onApplicationLoad(game);
}

//Update the application
const frame = {delta: 0, then: 0, count: 0};
function update(now = 0)
{
	now *= 0.001;
	frame.delta = now - frame.then;
	frame.then = now;
	++frame.count;
  game.update(frame);
  onApplicationUpdate(game, frame);

  //Already registered to be called again...
}

//Start the server...
start();

/******************************************************************************/

/**
 * Called when game is loaded, but before the game loop
 */
function onApplicationLoad(app)
{
  console.log("Loading server...");
  app.load(() => {
    update();
    setInterval(() => {
      update(Date.now());
    }, 1000 / FPS);
  });
}

/**
 * Called every tick by the game loop
 */
function onApplicationUpdate(app, frame)
{

}
