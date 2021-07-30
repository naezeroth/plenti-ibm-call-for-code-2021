var path = require("path");
const Dotenv = require("dotenv-webpack");
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  target: "node",
  mode: "production",
  plugins: [
    new Dotenv({
      path: "../.env",
    }),
  ],
};
