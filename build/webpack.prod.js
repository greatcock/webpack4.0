const merge = require('webpack-merge')
const path = require('path')
const commonConfig = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //此插件暂时不支持热替换 所以就用在线上打包环境中 分割CSS代码
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css


function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

const prodConfig = {
    mode: 'production', //默认是product  process.env.NODE_ENV会等于development或者production, tongshi 
    // devtool: 'cheap-module-source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        })
    ],

    module: {
        rules: [{
            test: /\.(scss|css)$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2, //在css里面如果引入了import语法 也会从新走'postcss-loader'和'sass-loader'
                        // modules: true, //开启css的模块化
                    }
                },
                'postcss-loader', //自动加前缀
                'sass-loader'
            ]
        }]
    },

    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],  //如果多个JS引入同一个CSS 那么会打包一个css 如果一个js里面 引入多个css 也会只打包一个
        // splitChunks: {
        //     cacheGroups: {
        //         indexStyles: {
        //             name: 'index',
        //             test: (m, c, entry = 'index') =>
        //                 m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
        //             chunks: 'all',
        //             enforce: true,
        //         },
        //         bStyles: {
        //             name: 'b',
        //             test: (m, c, entry = 'b') =>
        //                 m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
        //             chunks: 'all',
        //             enforce: true,
        //         },
        //     },
        // }
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../test')
    }
}
module.exports = merge(commonConfig, prodConfig)