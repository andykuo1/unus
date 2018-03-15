import AssetManager from './asset/AssetManager.js';
import ViewPort from './camera/ViewPort.js';
import Camera from './camera/OrthographicCamera.js';

import Shader from './mogli/Shader.js';
import Program from './mogli/Program.js';
import Mesh from './mogli/Mesh.js';

import gl from './mogli/gl.js';

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

  load(callback)
  {
    this.assets.register('shader', 'vdef', './res/def.vsh');
    this.assets.register('shader', 'fdef', './res/def.fsh');

    this.assets.flush(() => {
      this._prepareAssets();
      callback();
    });
  }

  _prepareAssets(callback)
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
        if (Renderer.RENDER_SERVER_STATE)
        {
          gl.uniform3fv(this.prgm.uniforms.uColor, [0.3, 0.3, 0.3]);
          for(const serverEntity of world.serverState.entities)
          {
            if (!serverEntity.renderable || !serverEntity.renderable.visible) continue;

            //Setting up the Model Matrix
            mat4.fromRotationTranslationScale(modelview,
              [0, 0, 0, 1],
              [serverEntity.transform.x, serverEntity.transform.y, 0],
              serverEntity.transform.scale);
            mat4.mul(modelview, view, modelview);
      			gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

            //Draw it!
            Mesh.draw(this.mesh);
          }
          gl.clear(gl.DEPTH_BUFFER_BIT);
        }

        for(const entity of world.entities)
        {
          const renderable = entity.renderable;
          if (!renderable || !renderable.visible) continue;

          gl.uniform3fv(this.prgm.uniforms.uColor,
            [((renderable.color >> 16) & 0xFF) / 255.0,
            ((renderable.color >> 8) & 0xFF) / 255.0,
            ((renderable.color) & 0xFF) / 255.0]);

          //Setting up the Model Matrix
          mat4.fromRotationTranslationScale(modelview,
            [0, 0, 0, 1],
            [entity.transform.x, entity.transform.y, 0],
            entity.transform.scale);
          mat4.mul(modelview, view, modelview);
    			gl.uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

          //Draw it!
          Mesh.draw(this.mesh);
        }
			}
			this.mesh.unbind();
		}
		this.prgm.unbind();
  }
}

Renderer.RENDER_SERVER_STATE = true;

export default Renderer;
