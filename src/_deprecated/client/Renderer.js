import { mat4 } from 'gl-matrix';
import gl from 'client/mogli/gl.js';

import AssetManager from 'client/asset/AssetManager.js';
import ViewPort from 'client/camera/ViewPort.js';
import Camera from 'client/camera/OrthographicCamera.js';

import Shader from 'client/mogli/Shader.js';
import Program from 'client/mogli/Program.js';
import Mesh from 'client/mogli/Mesh.js';

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
          for(const serverEntity of Object.values(world.serverState.entities))
          {
            if (!serverEntity.components.renderable || !serverEntity.components.renderable.visible) continue;

            //Setting up the Model Matrix
            mat4.fromRotationTranslationScale(modelview,
              serverEntity.components.transform.rotation,
              [serverEntity.components.transform.x, serverEntity.components.transform.y, 0],
              serverEntity.components.transform.scale);
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
            entity.transform.rotation,
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
