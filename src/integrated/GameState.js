/**
 * Represents any synchronized world state data across the network.
 * Updated and sent at the end of every game loop.
 */
class GameState
{
  constructor(name)
  {
    this.name = name;
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
  getChanges(dst)
  {}

  /**
   * Puts all data that is different from the nextState into this state.
   * Changes will be marked as unresolved. Call poll(state) to resolve them.
   */
  update(nextState)
  {
    if (nextState instanceof GameState)
    {
      nextState = nextState.data;
    }

    for(let key in nextState)
    {
      this.setData(key, nextState[key]);
    }
  }

  /**
   * Empty the state of any data, changed or not.
   */
  clear()
  {
  }
}

export default GameState;
