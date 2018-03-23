const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack');
module.exports = merge(baseWebpackConfig, {
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader",
                options: {
                    modules: false
                }
            }, {
                loader: 'postcss-loader'
            }]
        }]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
})