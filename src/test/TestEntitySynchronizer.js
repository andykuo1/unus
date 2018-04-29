import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';
import EntityManager from 'shared/entity/EntityManager.js';

function TestComponent()
{
  this.a = 0;
  this.b = "first";
}

TestComponent.sync = {
  a: { type: 'integer' },
  b: { type: 'string' }
};

const entityManager = new EntityManager();
const entitySynchronizer = new EntitySynchronizer(entityManager);
entitySynchronizer.customComponents.TestComponent = TestComponent;

entityManager.registerEntity('test', function(){
  this.addComponent(TestComponent);
});

const entity = entityManager.spawnEntity('test');

checkCurrentWorldState(entityManager);

console.log();
let payload = null;

console.log("Serialize the state...");
payload = entitySynchronizer.serialize(true);
console.log(JSON.stringify(payload));

console.log();

console.log("Serialize the same state, but this time send empty...");
payload = entitySynchronizer.serialize(false);
console.log(JSON.stringify(payload));

console.log();

console.log("Serialize the diff state...");
entity.TestComponent.b = "second";
payload = entitySynchronizer.serialize(false);
console.log(JSON.stringify(payload));

console.log();

console.log("Testing entity events...");
const newEntity = entityManager.spawnEntity('test');
entityManager.destroyEntity(entity);
payload = entitySynchronizer.serialize(false);
console.log(JSON.stringify(payload));

console.log();

console.log("Serialize the same state, but this time send empty...");
payload = entitySynchronizer.serialize(false);
console.log(JSON.stringify(payload));

console.log();

checkCurrentWorldState(entityManager);

console.log();

console.log("Testing deserialization...");

const newEntityManager = new EntityManager();
const newEntitySynchronizer = new EntitySynchronizer(newEntityManager);
newEntitySynchronizer.customComponents.TestComponent = TestComponent;

let newPayload = entitySynchronizer.serialize(true);
newEntitySynchronizer.deserialize(newPayload);

checkCurrentWorldState(newEntityManager);

console.log();

console.log("Testing deserialization with changes");

checkCurrentWorldState(entityManager);

console.log("Changing a to -1");
newEntity.TestComponent.a = -1;

checkCurrentWorldState(entityManager);

console.log("deserializing to new state:");
newPayload = entitySynchronizer.serialize(false);
newEntitySynchronizer.deserialize(newPayload);

checkCurrentWorldState(newEntityManager);

console.log();

console.log("Testing deserialization with events...");

console.log("destroyed entity");
entityManager.destroyEntity(newEntity);

console.log("deserializing to new state:");
newPayload = entitySynchronizer.serialize(false);
newEntitySynchronizer.deserialize(newPayload);

checkCurrentWorldState(newEntityManager);

console.log("... should be empty.");

function checkCurrentWorldState(entityManager)
{
  console.log("Checking current world state...");
  for(const entity of entityManager.entities)
  {
    let message = entity.id + " ";
    const components = entity.getComponents();
    for(const component of components)
    {
      message += JSON.stringify(entity[component.name]) + ", ";
    }
    console.log(message);
  }
  console.log();
}
