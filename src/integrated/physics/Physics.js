//Physics Engine

class PhysicsEngine
{
  constructor()
  {
    this.bodies = [];
  }
}

class PhysicsBody
{
  constructor()
  {
    this.x = 0;
    this.y = 0;
    this.shape = new Shape();
  }
}

class Shape
{

}

class Square extends Shape
{

}

class Circle extends Shape
{

}

class Ray extends Shape
{

}

class Point extends Shape
{

}

function update(delta)
{
  for(let body of this.bodies)
  {
    for(let other of this.bodies)
    {
      if (body == other) continue;
      let collision = checkCollision(body, other);
      if (collision)
      {
        //TODO: COLLISION RESPONSE
      }
    }
  }
}

function checkCollision(body, other) //check rectangle collision
{
  var shape1 = body.shape;
  var shape2 = other.shape;

  if (body.x < other.x + other.width &&
     body.x + body.width > other.x &&
     body.y < other.y + other.height &&
     body.height + body.y > other.y)
  {
    //TODO: Collision response
    return true;
  }

  return false;
}
