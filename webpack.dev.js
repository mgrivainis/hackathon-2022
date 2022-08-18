const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",

  devServer: {
    static: "./dist",
    port: 4205,
    client: {
      overlay: true,
    },
  },
});
