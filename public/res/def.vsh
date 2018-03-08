attribute vec4 aPosition;

uniform mat4 uModelView;
uniform mat4 uProjection;

void main()
{
  gl_Position = uProjection * uModelView * aPosition;
}
