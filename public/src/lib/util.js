/* * * * * * * * * * * * * * * * RENDER SYSTEMS * * * * * * * * * * * * * * * */

/**
 * Manages and dispatches render calls to the necessary layers.
 * Must add(RenderLayer) to this.layers before load() is called, the order in
 * which it is added is also the order it will be loaded, bound, rendered, etc.
 */
class RenderManager
{
  constructor()
  {
    this.layers = [];
  }

  addLayer(layer)
  {
    this.layers.add(layer);
    return this; //For method chaining
  }

  removeLayer(layer)
  {
    this.layers.remove(layer);
    return this; //For method chaining
  }

  load(gl)
  {
    let len = this.layers.length;
    for(let i = 0; i < len; ++i)
    {
      //TODO: this should be in a try block to properly load all other things
      this.layers[i].load(gl);
    }
  }

  unload(gl)
  {
    for(let i = this.layers.length; i >= 0; --i)
    {
      //TODO: this should be in a try block to properly unload all other things
      this.layers[i].unload(gl);
    }
  }

  render(gl, worldstate)
  {
    let len = this.layers.length;
    for(let i = 0; i < len; ++i)
    {
      this.layers[i].bind(gl);
      //TODO: This should be in a try block, since it should be guaranteed to unbind
      {
        let layer = this.layers[i];
        layer.render(gl, worldstate);
      }
      this.layers[i].unbind(gl);
    }
  }
}

/**
 * Used by RenderManager to render worldstate.
 */
class RenderLayer
{
  load(gl)
  {

  }

  unload(gl)
  {
    //TODO: Should be guaranteed to be called if load(gl) is called.
  }

  bind(gl)
  {

  }

  unbind(gl)
  {
    //TODO: Should be guaranteed to be called if bind(gl) is called.
  }

  render(gl, worldstate)
  {

  }
}

function loadOBJ(string)
{
  var lines = string.split("\n");
  var positions = [];
  var normals = [];
  var vertices = [];

  for ( var i = 0 ; i < lines.length ; i++ ) {
    var parts = lines[i].trimRight().split(' ');
    if ( parts.length > 0 ) {
      switch(parts[0]) {
        case 'v':  positions.push(
          vec3.fromValues(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          ));
          break;
        case 'vn':
          normals.push(
            vec3.fromValues(
              parseFloat(parts[1]),
              parseFloat(parts[2]),
              parseFloat(parts[3])
          ));
          break;
        case 'f': {
          var f1 = parts[1].split('/');
          var f2 = parts[2].split('/');
          var f3 = parts[3].split('/');
          Array.prototype.push.apply(
            vertices, positions[parseInt(f1[0]) - 1]
          );
          Array.prototype.push.apply(
            vertices, normals[parseInt(f1[2]) - 1]
          );
          Array.prototype.push.apply(
            vertices, positions[parseInt(f2[0]) - 1]
          );
          Array.prototype.push.apply(
            vertices, normals[parseInt(f2[2]) - 1]
          );
          Array.prototype.push.apply(
            vertices, positions[parseInt(f3[0]) - 1]
          );
          Array.prototype.push.apply(
            vertices, normals[parseInt(f3[2]) - 1]
          );
          break;
        }
      }
    }
  }
  var vertexCount = vertices.length / 6;
  console.log("Loaded mesh with " + vertexCount + " vertices");
  return {
    primitiveType: 'TRIANGLES',
    vertices: new Float32Array(vertices),
    vertexCount: vertexCount
  };
}
