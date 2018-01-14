var socket;
var app;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

//Canvas Setup
const canvas = document.querySelector("#content");
canvas.width = screenWidth;
canvas.height = screenHeight;

//WebGL Setup
const gl = canvas.getContext("webgl");

if (!gl)
{
	alert("Unable to initialize WebGL. Your browser or machine may not support it");
	throw new Error();
}

//Clear screen
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

function start()
{
	socket = io.connect('https://localhost');
	app = new Application();
	app.doNetwork(socket);
	render(0);
}

var then = 0;
function render(now)
{
	now *= 0.001;
	const deltaTime = now - then;
	then = now;

	app.doUpdate();
	app.doRender(gl, deltaTime);
	requestAnimationFrame(render);
}

//Window load callback
window.onload = function()
{
	start();
}

//Window resize callback
window.addEventListener('resize', function() {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	canvas.width = screenWidth;
	canvas.height = screenHeight;
}, true);
