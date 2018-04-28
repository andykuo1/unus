console.log("======== Starting test.... ========");

const Eventable = {
  emit(data)
  {
    console.log("EVENT! - " + data);
  }
};

class EventHandler
{
}
Object.assign(EventHandler.prototype, Eventable);

class TestHandler
{
  constructor()
  {
    this.emit("CONSTRUCTOR - SUCCESS!");
  }
}
Object.assign(TestHandler.prototype, Eventable);

let handler = new TestHandler();
handler.emit("OUTSIDE - SUCCESS!");

new EventHandler().emit("FROM EMPTY - SUCCESS!");

console.log("======== Stopping test.... ========");
