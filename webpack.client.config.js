var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src/client.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle-client.js'
  }
};
