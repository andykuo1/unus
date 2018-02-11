const canvas = document.getElementById('canvas');
const socket = io();
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
