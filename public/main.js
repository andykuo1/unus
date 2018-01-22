
/**
 * Application - The main entry point for the program
 */
class Application
{
	/**
	 * doStart - Called first before the application runs
	 */
	doStart()
	{
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
				-1.0, 1.0,
				1.0, 1.0,
				1.0, -1.0,
				-1.0, -1.0
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
	 * doUpdate - Called every frame to update the application
	 */
	doUpdate()
	{

	}

	/**
	 * doRender - Called every frame to render the application
	 */
	doRender(gl)
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
