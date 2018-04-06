import EntitySystem from 'game/EntitySystem.js';
import TransformComponent from 'game/TransformComponent.js';

console.log("======== Starting test.... ========");

const STARTX = 101;
const STARTY = 10;
const POSX = 3;
const POSY = 2;
const POSZ = 1;

const entitySystem = new EntitySystem();
entitySystem.manager.registerEntity('player', function() {
  this.addComponent(TransformComponent);
  this.transform.x = STARTX;
  this.transform.y = STARTY;
  this.transform.position[0] = POSX;
  this.transform.position[1] = POSY;
  this.transform.position[2] = POSZ;
});
const entity = entitySystem.manager.spawnEntity('player');

console.log("Serializing...");
const payload = entitySystem.serialize();
console.log(entity.transform);
console.log(JSON.stringify(payload, null, ' '));

console.log("Changing player...");
entity.transform.x = -1;
entity.transform.y = -1;
entity.transform.position[0] = 1;
entity.transform.position[1] = 5;
entity.transform.position[2] = 3;
console.log(entity.transform);

console.log("And now for deserialization...");
entitySystem.deserialize(payload);
console.log(entity.transform);

if (entity.transform.x === STARTX) console.log("SUCCESS!");
if (entity.transform.y === STARTX) console.log("SUCCESS!");
if (entity.transform.position[0] === POSX) console.log("SUCCESS!");
if (entity.transform.position[1] === POSY) console.log("SUCCESS!");
if (entity.transform.position[2] === POSZ) console.log("SUCCESS!");

console.log("======== Stopping test.... ========");
