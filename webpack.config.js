const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const env = process.env.NODE_ENV;

const isProduction = env === 'production';
const isHot = env === 'hot';

const enableSourceMaps = isProduction === false;

module.exports = {
    devtool: isProduction ? null : 'cheap-module-eval-source-map',
    entry: {
        'bundles/Mobile': path.resolve('sources/mobile/Mobile.js')
    },
    devServer: isHot ? {
        contentBase: path.resolve('./public')
    } : null,
    output: {
        path: path.resolve('./public/dist'),
        // filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
        filename: '[name].js',
        publicPath: `${isHot ? 'http://localhost:8080' : ''}/dist/`
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loaders: ['babel?cacheDirectory=true']
            },
            {
                test: /\.scss$/,
                loaders: ['style', `css?sourceMap=${enableSourceMaps}&url=false`, `sass?sourceMap=${enableSourceMaps}`]
            },
            {
                test: /\.css$/,
                loaders: ['style', `css?sourceMap=${enableSourceMaps}&url=false`]
            }
        ]
    },
    plugins: [
        isProduction && new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, sourceMap: false}),
        isProduction && new CompressionPlugin({
            algorithm: 'gzip'
        })
    ].filter(Boolean),
    resolve: {
        root: [
            path.resolve('sources')
        ]
    }
};