
//WebGL Setup
const gl = canvas.getContext('webgl');
if (!gl) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const camera = new OrthographicCamera();
camera.transform.position[2] = 1.0;
const viewport = new Viewport();

square = null;
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

      /**** ENTIT CODE BELOW! ****/

      var e = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      e.transform.position[0] = 1;

      e = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      e.transform.position[0] = -1;

      square = this.entityManager.createEntity(["transform", "renderable", "motion"]);
      square.transform.position[1] = 1;
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
    var dx = clientPos[0] - square.transform.position[0];
    var dy = -clientPos[1] + square.transform.position[1];
    let rotation = -Math.atan2(dy, dx);

    const speed = 0.1;
    square.transform.position[0] += Math.cos(rotation) * speed;
    square.transform.position[1] += Math.sin(rotation) * speed;

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

class TransformSystem extends System
{
  constructor()
  {
    super("transform");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);

    entity.transform = new Transform();
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.transform;
  }
}

class SolidSystem extends System
{
  constructor()
  {
    super("solid");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");

    entity.radius = 0.5;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.radius;
  }
}

class RenderableSystem extends System
{
  constructor()
  {
    super("renderable");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");
  }
}

class MotionSystem extends System
{
  constructor()
  {
    super("motion");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");

    entity.motion = vec2.create();
    entity.friction = 0.1;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.motion;
    delete entity.friction;
  }

  onUpdate()
  {
    super.onUpdate();

    for(let i in this.entities)
    {
      let entity = this.entities[i];
      entity.transform.position[0] += entity.motion[0];
      entity.transform.position[1] += entity.motion[1];

      const fric = 1.0 - entity.friction;
      entity.motion[0] *= fric;
      entity.motion[1] *= fric;

      if (entity.motion[0] < MotionSystem.MOTION_MIN && entity.motion[0] > -MotionSystem.MOTION_MIN) entity.motion[0] = 0;
      if (entity.motion[1] < MotionSystem.MOTION_MIN && entity.motion[1] > -MotionSystem.MOTION_MIN) entity.motion[1] = 0;
    }
  }
}
MotionSystem.MOTION_MIN = 0.01;

class FollowSystem extends System
{
  constructor()
  {
    super("follow");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");
    this.requireComponent(entity, "motion");
    this.requireComponent(entity, "solid");

    entity.target = null;
    entity.distance = 1.0;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.target;
    delete entity.distance;
  }

  onUpdate()
  {
    super.onUpdate();

    for(let i in this.entities)
    {
      var entity = this.entities[i];
      var target = entity.target;
      if (target != null)
      {
        var dx = entity.transform.position[0] - target.transform.position[0];
        var dy = entity.transform.position[1] - target.transform.position[1];
        var dx2 = dx * dx;
        var dy2 = dy * dy;
        var d = dx * dx + dy * dy;
        //TODO: COMPLETE THIS!
        entity.motion[0] += dx / d;
        entity.motion[1] += dy / d;
      }
    }
  }
}
