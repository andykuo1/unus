class Transform
{
  constructor(x = 0, y = 0, z = 0)
  {
    this.position = vec3.create();
    vec3.set(this.position, x, y, z);

    this.rotation = quat.create();
    this.scale = vec3.create();
    vec3.set(this.scale, 1, 1, 1);
  }

  getTransformation(dst)
  {
    mat4.fromRotationTranslationScale(dst, this.rotation, this.position, this.scale);
    return dst;
  }
}
