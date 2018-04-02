//Physics Engine

/*
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

entity.addComponent(PhysicsComponent);
entity.physics.shape = new Circle();

entity.componentList.add(new PhysicsComponent());

class PhysicsComponent
{
  constructor()
  {
    this.shape = null;
  }
}

class Circle extends Shape
{
  constructor(radius)
  {
    this.radius = radius;
  }
}

//TODO: Make a component that holds Shape.
//PhysicsComponent.js
// -> ???
function checkCollison(entity, other)
{
  if (entity.physics.shape instanceof Circle && other.physics.shape instanceof Circle)
  {
    const x = entity.transform.x;
    const y = entity.transform.y;
    const otherX = other.transform.x;
    const otherY = other.transform.y;

    const dist = entity.physics.shape.radius + other.physics.shape.radius;
    const dx = x - otherX;
    const dy = y - otherY;

    return dx * dx + dy * dy < dist * dist;
  }

  throw new Error("cannot find valid shape type");
}

function resolveCollisions(entities, dt)
{
  //Calculate all collisions
  //Resolves all collisions so that none are inside each other or bounce off.
  //dt = how much to move forward in time
  for(const entity of entities)
  {
    for(const other of entities)
    {
      if(entity == other) continue;
      //check collision with other
      const isColliding = checkCollision(entity, other);
      if (isColliding)
      {

      }
    }
  }
}







class Square extends Shape
{
  var rect1 = {x: 5, y: 5, width: 50, height: 50}
var rect2 = {x: 20, y: 10, width: 10, height: 10}

if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y) {
    // collision detected!
}

// filling in the values =>

if (5 < 30 &&
    55 > 20 &&
    5 < 20 &&
    55 > 10) {
    // collision detected!
}
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
*/
