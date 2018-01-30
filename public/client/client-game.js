
//WebGL Setup
const gl = canvas.getContext('webgl');
if (!gl) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const camera = new PerspectiveCamera();
camera.transform.position.z = 0.0;
const viewport = new Viewport();

function updateView()
{
  viewport.width = gl.canvas.clientWidth;
  viewport.height = gl.canvas.clientHeight;
  viewport.applyView();
}

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
    updateView();

    //Calculate rotation
    let mousePos = getPointFromScreen(vec3.create(), camera, viewport, mouse.x, mouse.y);
    /*
    var centerX = screenWidth / 2;
    var centerY = screenHeight / 2;
    var dx = mouse.x - centerX;
    var dy = mouse.y - centerY;
    let rotation = -Math.atan2(dy, dx);
    const speed = 0.1;
    square.x += Math.cos(rotation) * speed;
    square.y += Math.sin(rotation) * speed;
    */
    square.x = mousePos.x;
    square.y = mousePos.y;

    //Setting up the Projection Matrix
    const projection = camera.getProjection();

    //Setting up the ModelView Matrix
		const modelview = mat4.create();
		mat4.translate(modelview, modelview, [square.x, square.y, -6.0]);
    //mat4.rotateZ(modelview, modelview, rotation);
    mat4.mul(modelview, camera.getView(), modelview);

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

square = {x: 0, y: 0};
mouse = {x: 0, y: 0};

document.addEventListener('mousemove', function(event){
  let screen = canvas.getBoundingClientRect();
  var posX = event.clientX - screen.left;
  var posY = event.clientY - screen.top;
  mouse.x = posX;
  mouse.y = posY;
});
