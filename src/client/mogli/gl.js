var gl = {
  //WebGL Setup
  init: function(canvas) {
    console.log("Initializing WebGL...");
    gl = canvas.getContext('webgl');
    if (!gl) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    console.log("Found WebGL " + gl.VERSION);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
};

export default gl;
