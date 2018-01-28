const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if ("help" === input)
  {
    console.log("Welcome to your help.");
    console.log("Press \'CTRL-C\' to close the server.");
  }
  else if ("stop" === input)
  {
    console.log("Stopping server...");
    console.log("Server stopped...");
    System.exit(0);

  }

  else
  {
    console.log("Unknown command \'" + input + "\'");
  }
});
