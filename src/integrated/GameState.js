/**
 * Represents any synchronized world state data across the network.
 * Updated and sent at the end of every game loop.
 */
class GameState
{
  constructor()
  {
    this.data = {};
    this.dirty = {};
  }

  /**
   * Set the data with id to the value passed-in.
   * If client-side, will be marked to be sent to the server.
   * If server-side, will be marked to be sent to all clients.
   */
  setData(id, value)
  {
    this.data[id] = value;
    this.dirty[id] = true;
  }

  removeData(id)
  {
    this.data.remove(id);
    this.dirty.remove(id);
  }

  getData(id)
  {
    return this.data[id];
  }

  /**
   * Mark the data to be sent to the opposite side.
   * Should already be marked if called setData().
   */
  markDirty(id)
  {
    this.dirty[id] = true;
  }

  /**
   * Whether or not the side has already resolved this data if changed.
   */
  isDirty(id)
  {
    return this.dirty[id];
  }

  /**
   * Gets all data that has changed since and put them in 'state'.
   * All changes before this call is considered as resolved.
   */
  poll(state)
  {}

  /**
   * Puts all data that is different from the nextState into this state.
   * Changes will be marked as unresolved. Call poll(state) to resolve them.
   */
  update(nextState)
  {}

  /**
   * Empty the state of any data, changed or not.
   */
  clear()
  {}
}

export default GameState;
