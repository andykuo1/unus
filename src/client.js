import socketio from 'socket.io-client';

//Window Setup
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}, true);

import Application from 'Application.js';
import ClientEngine from 'client/ClientEngine.js';

//Application Setup
function onWindowLoad()
{
	const client = Application.client = new ClientEngine(Application, canvas, socketio());
	client.initialize()
		.then(() => Application.start());
}

//Start the client...
window.onload = onWindowLoad;
