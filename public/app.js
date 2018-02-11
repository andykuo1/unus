import Application from './client/client-game.js';

var socket = io();
var app;

//Canvas Setup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Change canvas on resize
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}, true);

//Window load callback
window.onload = start;

//Application setup
function start()
{
	let scripts = [];
	//scripts.push("/mogli.js");
	//scripts.push("/transform.js");
	//scripts.push("/camera.js");
	//scripts.push("/ecs.js");
	//scripts.push("/util.js");
	//scripts.push("/input.js");

	//TODO: Implement a way to properly load shader files
	//scripts.push("/res/def.vsh");
	//scripts.push("/res/def.fsh");

	//Load the game...
	//scripts.push("/client/client-game.js");

	app = new Application();
	let run = function () {
		app.onStart();
		render();
	};

	if (app.onLoad)
	{
		app.onLoad(run);
	}
	else
	{
		run();
	}
}

const frameTime = {delta: 0, then: 0, count: 0};
function render(now = 0)
{
	now *= 0.001;
	frameTime.delta = now - frameTime.then;
	frameTime.then = now;
	++frameTime.count;

	app.onUpdate();
	requestAnimationFrame(render);
}

//Display frames per second
setInterval(function(){
	console.log("FPS: " + frameTime.count);
	frameTime.count = 0;
}, 1000);

export {
	socket
}
