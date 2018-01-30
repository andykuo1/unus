
//WebGL Setup
const gl = canvas.getContext('webgl');
if (!gl) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const camera = new OrthographicCamera();
camera.transform.position[2] = 1;
const viewport = new Viewport();

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
    //TODO: load resources the proper way...
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
				-1.0, 1.0,
				1.0, 1.0,
				1.0, -1.0,
				-1.0, -1.0
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
    viewport.applyView();

    //Calculate rotation
    let mousePos = getPointFromScreen(vec3.create(), camera, viewport, mouse[0], mouse[1]);
    var dx = mousePos[0] - square[0];
    var dy = -mousePos[1] + square[1];
    let rotation = -Math.atan2(dy, dx);

    const speed = 0.1;
    square[0] += Math.cos(rotation) * speed;
    square[1] += Math.sin(rotation) * speed;

    //Setting up the Projection Matrix
    const projection = camera.getProjection();

    //Setting up the ModelView Matrix
		const modelview = mat4.create();
    //Model
		mat4.translate(modelview, modelview, [square[0], square[1], 0.0]);
    mat4.rotateZ(modelview, modelview, rotation);
    //View
    mat4.mul(modelview, modelview, camera.getView());

		this.prgm.bind();
		{
			gl.uniformMatrix4fv(this.prgm.uniforms.uProjection, false, projection);
			gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

			this.mesh.bind();
			{
				Mesh.draw(this.mesh);
			}
			this.mesh.unbind();

      //mat4.identity(modelview);
			//gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

			this.mesh2.bind();
			{
				Mesh.draw(this.mesh2);
			}
			this.mesh2.unbind();
		}
		this.prgm.unbind();
  }
}

square = [0, 0];
mouse = [0, 0];

document.addEventListener('mousemove', function(event){
  let screen = canvas.getBoundingClientRect();
  var posX = event.clientX - screen.left;
  var posY = event.clientY - screen.top;
  mouse[0] = posX;
  mouse[1] = posY;
});
