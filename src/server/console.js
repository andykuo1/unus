import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if ("help" === input)
  {
    console.log("Welcome to your friendly neighborhood server help.");
    console.log("Press \'CTRL-C\' to close the server.");
  }
  else if ("stop" === input)
  {
    console.log("Stopping server...");
    //TODO: ADD state-preservation features...
    console.log("Server stopped...");
    process.exit(0);
  }
  else
  {
    console.log("Unknown command \'" + input + "\'");
  }
});
