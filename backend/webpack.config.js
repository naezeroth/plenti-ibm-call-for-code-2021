var path = require('path');
module.exports = {
  entry: './index.js',
  target: "node", // Or "async-node"
  mode: "production", 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'node',
  resolve: {
    symlinks: false,
    fallback: {
      util: require.resolve("util/")
    }
  },
};