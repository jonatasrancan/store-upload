const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
const commonConfig = require("./webpack.config.common");

commonConfig.mode = "production";
commonConfig.devtool = "source-map";
commonConfig.plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production"),
      HONEYBADGER_CLIENT_KEY: JSON.stringify(
        process.env.HONEYBADGER_CLIENT_KEY
      ),
      AUTH0_DOMAIN: JSON.stringify("MAGICSTRING_AUTH0_DOMAIN"),
      AUTH0_CLIENT_ID: JSON.stringify("MAGICSTRING_AUTH0_CLIENT_ID"),
      AUTH0_CALLBACK_URL: JSON.stringify("MAGICSTRING_AUTH0_CALLBACK_URL"),
      AUTH0_AUDIENCE: JSON.stringify("MAGICSTRING_AUTH0_AUDIENCE"),
      API_URL: JSON.stringify(process.env.API_URL),
      WS_URL: JSON.stringify(process.env.WS_URL),
      CMS_URL: JSON.stringify(process.env.CMS_URL)
    }
  })
];

module.exports = commonConfig

