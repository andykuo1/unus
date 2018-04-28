import { mat4 } from 'gl-matrix';
import gl from 'client/render/mogli/gl.js';

import AssetManager from 'client/render/AssetManager.js';
import ViewPort from 'client/render/camera/ViewPort.js';
import Camera from 'client/render/camera/OrthographicCamera.js';

import Shader from 'client/render/mogli/Shader.js';
import Program from 'client/render/mogli/Program.js';
import Mesh from 'client/render/mogli/Mesh.js';

class Renderer
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.viewport = new ViewPort(this.canvas);

    this.assets = new AssetManager();

    this.camera = new Camera(this.viewport);
    this.camera.transform.position[2] = 1.0;
  }

  async load()
  {
    this.assets.register('shader', 'vdef', './res/def.vsh');
    this.assets.register('shader', 'fdef', './res/def.fsh');

    await this.assets.fetchAssets();
    await this._prepareAssets();
  }

  async _prepareAssets()
  {
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

    console.log("Renderer fully loaded!");
  }

  render(world)
  {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.viewport.update();

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
        if (typeof world.entities != 'undefined')
        {
          for(const entity of world.entities)
          {
            const renderable = entity.renderable;
            drawObject(renderable.x, renderable.y, 0xFFFFFF, this, view, modelview);
          }
        }

        //Test rendering
        drawObject(0, 0, 0xFFFFFF, this, view, modelview);
			}
			this.mesh.unbind();
		}
		this.prgm.unbind();
  }
}

function drawObject(x, y, color, renderer, view, modelview)
{
  console.log(renderer.prgm);
  gl.uniform3fv(renderer.prgm.uniforms.uColor,
    [((color >> 16) & 0xFF) / 255.0,
    ((color >> 8) & 0xFF) / 255.0,
    ((color) & 0xFF) / 255.0]);

  //Setting up the Model Matrix
  mat4.fromRotationTranslationScale(modelview,
    [0, 0, 0, 0],
    [x, y, 0],
    [1, 1, 1]);
  mat4.mul(modelview, view, modelview);
  gl.uniformMatrix4fv(renderer.prgm.uniforms.uModelView, false, modelview);

  //Draw it!
  Mesh.draw(renderer.mesh);
}

Renderer.RENDER_SERVER_STATE = true;

export default Renderer;
