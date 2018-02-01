
//WebGL Setup
const gl = canvas.getContext('webgl');
if (!gl) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const camera = new OrthographicCamera();
camera.transform.position[2] = 1.0;
const viewport = new Viewport();

const square = [0, 0];
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
    //TODO: get a proper OBJ loader!
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

      this.entityManager = new EntityManager();
      this.entityManager.registerSystem(new TransformSystem());
      this.entityManager.registerSystem(new RenderableSystem());
      this.entityManager.registerSystem(new MotionSystem());

      var e = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      e.transform.position[0] = 1;

      e = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      e.transform.position[0] = -1;
  }

	/**
	 * onUpdate - Called every frame to update the application
	 */
  onUpdate()
  {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    viewport.applyView();

    /**** LOGIC CODE BELOW! ****/

    //Calculate rotation
    let clientPos = getPointFromScreen(vec3.create(), camera, viewport, clientInput.x, clientInput.y);
    var dx = clientPos[0] - square[0];
    var dy = -clientPos[1] + square[1];
    let rotation = -Math.atan2(dy, dx);

    const speed = 0.1;
    square[0] += Math.cos(rotation) * speed;
    square[1] += Math.sin(rotation) * speed;

    /**** RENDERING CODE BELOW! ****/

    //Setting up the Projection Matrix
    const projection = camera.projection;

    //Setting up the View Matrix
    const view = camera.view;
		const modelview = mat4.create();

		this.prgm.bind();
		{
			gl.uniformMatrix4fv(this.prgm.uniforms.uProjection, false, projection);

			this.mesh.bind();
			{
        let entities = this.entityManager.getEntities("renderable");
        for(let i in entities)
        {
          let entity = entities[i];
          if (entity.dead) continue;

          //Setting up the Model Matrix
          entity.transform.getTransformation(modelview);
          mat4.mul(modelview, modelview, view);
    			gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

          //Draw it!
          Mesh.draw(this.mesh);
        }
			}
			this.mesh.unbind();

      //mat4.identity(modelview);
			//gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

			this.mesh2.bind();
			{
        //Setting up the Model Matrix
        mat4.identity(modelview);
        mat4.translate(modelview, modelview, [square[0], square[1], 0.0]);
        mat4.rotateZ(modelview, modelview, rotation);
        gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

        //Draw it!
				Mesh.draw(this.mesh2);
			}
			this.mesh2.unbind();
		}
		this.prgm.unbind();
  }
}
