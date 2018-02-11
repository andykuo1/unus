import Mouse from '../Mouse.js';
import AssetManager from '../AssetManager.js';
import Transform from '../Transform.js';
import Viewport from '../Viewport.js';

import { TransformSystem, RenderableSystem, MotionSystem } from '../entities.js';
import { OrthographicCamera } from '../lib/camera.js';
import { Shader, Program, VBO, Mesh, gl } from '../lib/mogli.js';
import { Entity, EntityManager, System } from '../lib/ecs.js';

/**
 * Application - The main entry point for the program
 */
class Application {
  constructor()
  {
    this.assets = new AssetManager();
    this.camera = new OrthographicCamera();
    this.camera.transform.position[2] = 1.0;
    this.viewport = new Viewport();

    this.clientInput = new Mouse(document);

    this.square = null;
  }

  onLoad(callback)
  {
    //Register all resources here

    //Shaders
    this.assets.register('shader', 'vdef', './res/def.vsh');
    this.assets.register('shader', 'fdef', './res/def.fsh');

    this.assets.flush(callback);
  }

	/**
	 * onStart - Called first before the application runs
	 */
  onStart()
  {
    socket.on('connect', function() {
      console.log("Connected to server!");
    });
    //Close client when the server closes...
    socket.on('disconnect', function() {
      window.close();
    })

    let i = Math.random();
    //Test ping
    socket.emit('echo', {value: i});
    console.log("Echoing \'" + i + "\'...");

		//Load resources
		const vsrc = this.assets.getAsset('shader', 'vdef');
		const fsrc = this.assets.getAsset('shader', 'fdef');

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

      /**** ENTIT CODE BELOW! ****/

      var e = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      e.transform.position[0] = 1;

      e = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      e.transform.position[0] = -1;

      this.square = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      this.square.transform.position[1] = 1;
  }

	/**
	 * onUpdate - Called every frame to update the application
	 */
  onUpdate()
  {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.viewport.applyView();

    /**** LOGIC CODE BELOW! ****/

    //Calculate rotation
    let clientPos = Viewport.getPointFromScreen(vec3.create(), this.camera, this.viewport, this.clientInput.x, this.clientInput.y);
    var dx = clientPos[0] - this.square.transform.position[0];
    var dy = -clientPos[1] + this.square.transform.position[1];
    let rotation = -Math.atan2(dy, dx);

    const speed = 0.1;
    this.square.transform.position[0] += Math.cos(rotation) * speed;
    this.square.transform.position[1] += Math.sin(rotation) * speed;

    /**** RENDERING CODE BELOW! ****/

    //Setting up the Projection Matrix
    const projection = this.camera.projection;

    //Setting up the View Matrix
    const view = this.camera.view;
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

      /*
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
      */
		}
		this.prgm.unbind();
  }
}

app = new Application();
export default Application;
