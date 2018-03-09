import express from 'express';
import path from 'path'
import socketio from 'socket.io';

import ServerGame from './server/ServerGame.js';
import NetworkHandler from './integrated/NetworkHandler.js';
import Frame from './util/Frame.js';

const __dirname = path.resolve();
const DEVMODE = process.argv.indexOf('--dev') != -1;
const TIMESTEP = 1000/1;
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
  game = new ServerGame(new NetworkHandler(io, false));
  onApplicationLoad(game);
}

//Update the application
const frame = new Frame();
function update(now = 0)
{
  frame.next(now);
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
  app.load(() => {
    app.connect(() => {
      update();
      const startTime = Date.now();
      setInterval(() => {
        update(Date.now() - startTime);
      }, TIMESTEP);
    });
  });
}

/**
 * Called every tick by the game loop
 */
function onApplicationUpdate(app, frame)
{

}
