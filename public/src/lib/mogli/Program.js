import gl from './gl.js';
import Shader from './Shader.js';

/**
 * Program - Manages and links related shaders. In order to set uniform values,
 * use gl.setUniform(program.uniforms.name, value).
 */
class Program
{
  constructor()
  {
    //Create Program
    this.handle = gl.createProgram();

    this.shaders = [];

    this.attribs = {};
    this.uniforms = {};
  }

  /**
   * close - Destroys the program object
   */
  close()
  {
    gl.deleteProgram(this.handle);
    this.handle = null;
  }

  /**
   * link - Attach passed-in shaders to this program and resolve all uniform and
   * attribute locations.
   *
   * @param {Array} shaders Array of shaders to be linked
   */
  link(shaders)
  {
    //Attach shaders
    var len = shaders.length;
    for(let i = 0; i < len; ++i)
    {
      let shader = shaders[i];
      this.shaders.push(shader);
      gl.attachShader(this.handle, shader.handle);
    }
    gl.linkProgram(this.handle);

    //Validate program links
    if (!gl.getProgramParameter(this.handle, gl.LINK_STATUS))
    {
      let info = gl.getProgramInfoLog(this.handle);
      gl.deleteProgram(this.handle);
      this.handle = null;
      throw new Error("Unable to initialize shader program: " + info);
    }

    //Resolve uniforms
    const uniformCount = gl.getProgramParameter(this.handle, gl.ACTIVE_UNIFORMS);
    for(let i = 0; i < uniformCount; ++i)
    {
      const info = gl.getActiveUniform(this.handle, i);
      console.log("...found uniform: \'" + info.name + "\'...");
      this.uniforms[info.name] = gl.getUniformLocation(this.handle, info.name);
    }

    //Resolve attributes
    const attribCount = gl.getProgramParameter(this.handle, gl.ACTIVE_ATTRIBUTES);
    for(let i = 0; i < attribCount; ++i)
    {
      const info = gl.getActiveAttrib(this.handle, i);
      console.log("...found attrib: \'" + info.name + "\'...");
      this.attribs[info.name] = gl.getAttribLocation(this.handle, info.name);
    }
  }

  /**
   * validate - Strictly validate the program state
   */
  validate()
  {
    gl.validateProgram(this.handle);

    if (!gl.getProgramParameter(this.handle, gl.VALIDATE_STATUS))
    {
      let info = gl.getProgramInfoLog(this.handle);
      gl.deleteProgram(this.handle);
      this.handle = null;
      throw new Error("Invalid program: " + info);
    }
  }

  bind()
  {
    gl.useProgram(this.handle);
  }

  unbind()
  {
    console.assert(this.isInUse(), "must call bind first!");
    gl.useProgram(null);
  }

  /**
   * isInUse - Whether the program is bound to the current context.
   *
   * @return {Boolean} Whether the program is bound to the current context.
   */
  isInUse()
  {
    return gl.getParameter(gl.CURRENT_PROGRAM) == this.handle;
  }

  /**
   * @deprecated locations already automatically resolved while linking shaders
   */
  findUniformLocation(name)
  {
    var loc = this.uniforms[name];
    if (!loc)
    {
      loc = gl.getUniformLocation(this.handle, name);
      if (loc == null)
      {
        throw new Error("Cannot find uniform with name: " + name);
      }

      this.uniforms[name] = loc;
    }
    return loc;
  }

  /**
   * @deprecated locations already automatically resolved while linking shaders
   */
  findAttribLocation(name)
  {
    var loc = this.attribs[name];
    if (!loc)
    {
      loc = gl.getAttribLocation(this.handle, name);
      if (loc == null)
      {
        throw new Error("Cannot find attribute with name: " + name);
      }

      this.attribs[name] = loc;
    }
    return loc;
  }
}

export default Program;
