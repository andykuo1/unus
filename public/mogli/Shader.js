import gl from 'gl.js';

/**
 * Shader - A GLSL shader representation
 */
class Shader
{
  /**
   * constructor - Shader definition
   *
   * @param {String} src The shader source
   * @param {Number} type The shader type
   */
  constructor(src, type)
  {
    this.type = type;

    //Create shader
    this.handle = gl.createShader(this.type);
    gl.shaderSource(this.handle, src);
    gl.compileShader(this.handle);

    //Validate shader
    if (!gl.getShaderParameter(this.handle, gl.COMPILE_STATUS))
    {
      let info = gl.getShaderInfoLog(this.handle);
      gl.deleteShader(this.handle);
      this.handle = null;
      throw new Error("Unable to compile shaders: " + info);
    }
  }

  /**
   * close - Destroys the shader object
   */
  close()
  {
    gl.deleteShader(this.handle);
    this.handle = null;
  }
}

export default Shader;
