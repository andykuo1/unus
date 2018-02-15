import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const command = {
  commands: new Map(),
  infos: new Map(),
  addCommand: function(name, info, callback)
  {
    this.commands.set(name, callback);
    this.infos.set(name, info);
    return this;
  },
  removeCommand: function(name)
  {
    this.commands.delete(name);
    this.infos.delete(name);
    return this;
  },
  hasCommand: function(name)
  {
    return this.commands.has(name);
  },
  getCommand: function(name)
  {
    return this.commands.get(name);
  },
  getCommandInfo: function(name)
  {
    return this.infos.get(name);
  }
};

rl.on('line', (input) => {
  let inputs = input.split(' ');
  let name = inputs[0];
  if (command.hasCommand(name))
  {
    let callback = command.getCommand(name);
    try
    {
      inputs.splice(0, 1);
      callback(inputs);
    }
    catch (e)
    {
      console.log(e);
      console.log(command.getCommandInfo(name));
    }
  }
  else if (name == "help")
  {
    console.log("Welcome to your friendly neighborhood server help.");
    console.log("Press \'CTRL-C\' or \'stop\' to close the server.");
  }
  else
  {
    console.log("ERROR: Unknown command \'" + name + "\'.");
  }
});

export default command;
