var socket;
var app;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

//Canvas Setup
const canvas = document.querySelector("#content");
canvas.width = screenWidth;
canvas.height = screenHeight;

//File Setup
//if (!window.File || !window.FileReader || !window.FileList)
//{
//	throw new Error("Unable to find File API. Your browser or machine may not support it.")
//}

//WebGL Setup
const gl = canvas.getContext("webgl");
if (!gl)
{
	throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
}

//Clear screen
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

function start()
{
	socket = io.connect('https://localhost');
	app = new Application();
	app.doStart();

	app.doNetwork(socket);
	render(0);
}

//Display frames per second
setInterval(function(){
	console.log("FPS: " + frameTime.count);
	frameTime.count = 0;
}, 1000);

const frameTime = {delta: 0, then: 0, count: 0};
function render(now)
{
	now *= 0.001;
	frameTime.delta = now - frameTime.then;
	frameTime.then = now;
	++frameTime.count;

	app.doUpdate();
	app.doRender(gl);
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
