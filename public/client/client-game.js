
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
				-0.9, 0.9,
				0.9, 0.9,
				0.9, -0.9,
				-0.9, -0.9
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
    //gl.viewport(0, 0, screenWidth, screenHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Setting up the Projection Matrix
		const fov = 45 * Math.PI / 180;
		const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const znear = 0.1;
		const zfar = 100.0;
		const projection = mat4.create();
		mat4.perspective(projection, fov, aspectRatio, znear, zfar);
    //mat4.ortho(projection, -1.0, 1.0, -1.0, 1.0, 0.1, 100);

    //Calculate rotation
    var centerX = screenWidth / 2;
    var centerY = screenHeight / 2;
    var dx = mouse.x - centerX;
    var dy = mouse.y - centerY;
    let rotation = -Math.atan2(dy, dx);

    const speed = 0.0001;

    var mx = mouse.x + centerX;
    var my = mouse.y + centerY;

    //calculate distance
    var distx = mx - square.x;
    var disty = my - square.y;

    //square.x += (distx / Math.abs(distx)) * speed;
    //square.y += (disty / Math.abs(disty)) * speed;

    /*
      TODO:
        Square
          moveTowardsMouse(mouse)
          {
            screen -> world

            //if we arent there yet
            if (square.x != mouse.x and square.y != mouse.y)
            {
              //distance btwn square and mouse
              var distx = mouse.x-square.x;
              var disty = mouse.y-square.y;
              square.x += distx / math.abs(distx);
              square.y += disty / math.abs(disty);
            }
          }
        Mouse
          screenx, screeny
        rotation = ...; //Square to mouse in world space

        speed =
        dx = Math.cos(rotation) * speed; Rcos(Ø) = X
        dy = Math.sin(rotation) * speed;

        square.x += dx;
        square.y += dy;

        //Draw at (x, y)
    */


    /* FIG. 1: ANDY's AWESOME DIAGRAM
                  * => MOUSE
                 /|
              /  y|
          /       |
      /)_____x____|
    * => SCREEN_CENTER
    */

    //Setting up the ModelView Matrix
		const modelview = mat4.create();
		mat4.translate(modelview, modelview, [square.x, square.y, -6.0]);
    mat4.rotateZ(modelview, modelview, rotation);

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

/*
function toWorldPosition(projection, view, screenX, screenY)
{

  mat4.mul()
  mat4 invertedViewProjection =
}
*/
