import socketio from 'socket.io-client';

import ClientGame from 'client/ClientGame.js';
import NetworkHandler from 'integrated/NetworkHandler.js';
import Frame from 'util/Frame.js';

//Window Setup
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}, true);
window.onload = start;

//Application setup
var socket = socketio();
var game;
function start()
{
  game = new ClientGame(new NetworkHandler(socket, true), canvas);
	onApplicationLoad(game);
}

//Update the application
const frame = new Frame();
function update(now = 0)
{
	frame.next(now);
  game.update(frame);
	onApplicationUpdate(game, frame);

  //Call again...
	requestAnimationFrame(update);
}

//Display frames per second
setInterval(function(){
	console.log("FPS: " + frame.count);
	frame.count = 0;
}, 1000);

/******************************************************************************/

/**
 * Called when game is loaded, but before the game loop
 */
function onApplicationLoad(app)
{
	app.load(() => {
		app.connect(() => {
			update();
		});
	});
}

/**
 * Called every tick by the game loop
 */
function onApplicationUpdate(app, frame)
{

}
