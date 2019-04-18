const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const devConfig = {
    mode: 'development', //默认是product  process.env.NODE_ENV会等于development或者production, tongshi 
    devtool: 'cheap-module-eval-source-map',
    // development 'cheap-module-eval-source-map'
    // production 'cheap-module-source-map'

    devServer: {
        contentBase: './test', //不写或者写个不存在的路径 默认会走output 打包后生成的默认路径 
        open: true,
        publicPath: '/', //打包后生成的静态放到的文件路径， 如果不设置 默认走output的publicPath
        hot: true, //开启热替换
        // hotOnly: true //如果HTML没有生效 那么就不自动刷新 
    },

    module: {
        rules: [{
            test: /\.(scss|css)$/,
            use: [
                //就在dev环境下用这个Loader  在开发环境 用css代码分割 以及自带的loader
                'style-loader', //拿到css loader生成的文件后 把css 挂在到html的heade里面
                // 'css-loader',  //分析css文件的依赖关系，把所有依赖的css文件 打包成一个文件  
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2, //在css里面如果引入了import语法 也会从新走'postcss-loader'和'sass-loader'
                        // modules: true, //开启css的模块化
                    }
                },
                'sass-loader',
                'postcss-loader' //自动加前缀
            ]
        }]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin() //开启热替换
    ],

    output: {
        filename: '[name].min.js',
        chunkFilename: '[name].aaa.js'
    }
}

module.exports = merge(commonConfig, devConfig)