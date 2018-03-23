const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack');
const path = require('path')

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            minimize: true,
                            sourceMap: true
                        }
                    },
                    'postcss-loader'
                ],
                fallback: 'style-loader'
            })
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: path.posix.join('css/amplifier.min.css')
        })
    ]
})