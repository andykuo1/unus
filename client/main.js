class Application
{
	doNetwork(socket)
	{
		console.log("Connecting...");
		console.log(socket);
	}

	doUpdate()
	{
		console.log("Running...");
	}

	doRender(gl, deltaTime)
	{
		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}
}
