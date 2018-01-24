# Project Unus

An online browser-based multiplayer game.

---
# Setup
First, as always, clone the git repo.

Then, open _Terminal_ in the directory 'unus'. To get the dependencies, run the command:

> npm install

This will create 'node_modules', which should now have all required dependencies.

# Running
To run the server, open the _Terminal_ at the project folder and run:

> node index.js

To run the client, open a browser and go to url for your _localhost_ at the specified port number found in the server files, for example:

> localhost:3000

To use additional script files on the client side, be sure to add the script's path to the script loader in _app.js_.

# Future Plans
* Load files with a pretty loading screen
* Find a better way to use multiple scripts
* Find a better way to load shader files
* Make textures, and basic graphics
* Find a way to load any resource files (textures, etc.)
* Register and verify users on connection (handshake)
* Store user attributes on a webserver somewhere (economy, stats)
* Implement a proper entity-component system
* Finish the game :)
