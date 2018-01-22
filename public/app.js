var socket = io();
var app;

//Canvas Setup
var	screenWidth = window.innerWidth;
var	screenHeight = window.innerHeight;
const canvas = document.querySelector('#canvas');
canvas.width = screenWidth;
canvas.height = screenHeight;
//Change canvas on resize
window.addEventListener('resize', function() {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	canvas.width = screenWidth;
	canvas.height = screenHeight;
}, true);

//Window load callback
window.onload = start;

//Application setup
function start()
{
	let scripts = [];
	scripts.push("public/client-test.js");
	load(scripts, function() {
		app = new Application();
		app.onStart();
		render();
	});
}

function load(files, callback, index = 0)
{
	if (index == 0)
	{
		console.log("Loading scripts...");
		let loader = document.querySelector('#scripts');
		//loader.style.display = 'block';
		//canvas.style.display = 'none';
	}

	if (index < files.length)
	{
		let file = files[index];
		console.log("...getting \'" + file + "\'...");

		/*
		//HTML implementation...
		let fileref = document.createElement('script');
		fileref.setAttribute('type', 'text/javascript');
		fileref.setAttribute('src', file);
		fileref.onload = function() {
			console.log("...evaluating...");
			load(files, callback, index + 1);
		};
		document.querySelector('#scripts').appendChild(fileref);
		*/


		//AJAX implementation...
		let request = new XMLHttpRequest();
		request.open('GET', file);
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					console.log("...evaluating...");
					var response = request.responseText;
					eval(response);
					load(files, callback, index + 1);
				}
				else
				{
					throw new Error("Failed request: " + request.status);
				}
			}
		};
		request.send();

	}
	else
	{
		let loader = document.querySelector('#scripts');
		//canvas.style.display = 'block';
		//loader.style.display = 'none';
		console.log("...Loaded " + index + " script(s)!");
		callback();
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
