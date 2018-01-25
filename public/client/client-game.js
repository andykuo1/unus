
//WebGL Setup
const gl = canvas.getContext('webgl');
if (!gl) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

/**
 * Application - The main entry point for the program
 */
class Application {
	/**
	 * onStart - Called first before the application runs
	 */
  onStart()
  {
    let i = Math.random();
    //Test ping
    socket.emit('echo', {value: i});
    console.log("Echoing \'" + i + "\'...");

		//Load resources
		const vsrc = vertexShaderDef;//loadFile("./res/def.vsh");
		const fsrc = fragmentShaderDef;//loadFile("./res/def.fsh");

		//Shader Programs
		var vertexShader = new Shader(vsrc, gl.VERTEX_SHADER);
		var fragmentShader = new Shader(fsrc, gl.FRAGMENT_SHADER);
		this.prgm = new Program();
		this.prgm.link([vertexShader, fragmentShader]);

		//Mesh
		this.mesh = Mesh.createMesh({
			position: new Float32Array([
				-0.5, 0.5,
				0.5, 0.5,
				0.5, -0.5,
				-0.5, -0.5
			]),
			indices: new Uint16Array([
				0, 1, 2, 3
			])},
			gl.GL_STATIC_DRAW);

		this.mesh2 = Mesh.createMesh({
			position: new Float32Array([
				-2.0, 2.0,
				2.0, 2.0,
				2.0, -2.0,
				-2.0, -2.0
			]),
			indices: new Uint16Array([
				0, 1, 2, 3
			])},
			gl.GL_STATIC_DRAW);
  }

	/**
	 * onUpdate - Called every frame to update the application
	 */
  onUpdate()
  {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const fov = 45 * Math.PI / 180;
		const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const znear = 0.1;
		const zfar = 100.0;
		const projection = mat4.create();
		mat4.perspective(projection, fov, aspectRatio, znear, zfar);

		const modelview = mat4.create();
		mat4.translate(modelview, modelview, [-0.0, 0.0, -6.0]);

		this.prgm.bind();
		{
			gl.uniformMatrix4fv(this.prgm.uniforms.uProjection, false, projection);
			gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);
			this.mesh.bind();
			{
				Mesh.draw(this.mesh);
			}
			this.mesh.unbind();

			this.mesh2.bind();
			{
				Mesh.draw(this.mesh2);
			}
			this.mesh2.unbind();
		}
		this.prgm.unbind();
  }
}

document.addEventListener('mousemove', function(event){
  let screen = canvas.getBoundingClientRect();
  var posX = evt.clientX - screen.left;
  var posY = evt.clientY - screen.top;

  console.log("mouse: " + posX + ", " + posY);
});
