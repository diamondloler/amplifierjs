const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const devConfig = require('./webpack.dev.conf.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(devConfig, options);
const compiler = webpack(devConfig);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});