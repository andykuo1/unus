import socketio from 'socket.io-client';

import Application from './Application.js';
import NetworkHandler from 'integrated/NetworkHandler.js';
import ClientGame from 'client/ClientGame.js';

//Window Setup
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}, true);

//Application Setup
function start()
{
	const socket = socketio();
	const network = new NetworkHandler(socket, true);
	const game = new ClientGame(network, canvas);
	Application.init(network, game)
		.then(() => { return game.load(); })
		.then(() => { return game.connect(); })
		.then(() => { requestAnimationFrame(onRequestAnimationFrame); });
}

function onRequestAnimationFrame()
{
	Application.update();
	requestAnimationFrame(onRequestAnimationFrame);
}

//Start the client...
window.onload = start;
