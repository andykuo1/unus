var path = require('path');

module.exports = {
  entry: __dirname + '/src/client.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },
};
