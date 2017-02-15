const webpack = require('webpack');

module.exports = {
    entry: './src/aframe.js',
    output: {
        path: './',
        filename: './dist/aframe.min.js',
        library: 'aframe',
        libraryTarget: 'umd'
    },
    externals: ['jquery'],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        new webpack.BannerPlugin('Copyright (c) 2017 Bartosz Lorek. MIT license')
    ]
}