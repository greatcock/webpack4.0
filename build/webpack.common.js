const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    entry: {
        index: './src/index.js',
        b: './src/b.js'
    },

    module: {
        rules: [{
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024, //比特
                        name: 'img/[name].[ext]'
                    }
                }
            }, {
                test: /\.(eot|ttf|svg)$/,
                use: [
                    'file-loader' //打包字体用 file-loader
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
                // options: {
                //     presets: ["@babel/preset-env"]
                // }
            }
        ]
    },

    performance: false,

    plugins: [
        new HtmlWebpackPlugin({
            inject: true, // true 是js  在Body后面生成  默认true
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
        //不需要每个JS文件里面都引入Import jquery了  加上这个后 会自动帮你在每个需要$的JS里面引入jquery
            $: 'jquery'   
        })
    ],

    optimization: {
        //开启tree shaking  去掉多余代码 只针对es6的暴露引入起作用
        //如果引入的polyfill 默认没有导出东西 但是不希望被去掉 
        //在package.json里面加上  "sideEffects": ["@babel/polly-fill"]
        //如果没有特殊要处理的函数。就写false  一般写["*.css"]
        usedExports: true,
        runtimeChunk: {
            name: 'runtimexxx'
        },
        splitChunks: {
            chunks: 'all', //开启代码分割，把公用的类库 打包成单独jS文件  如果什么都不写 官网有默认配置例子 会分割异步引入的代码
            // chunks: "async",   // 针对异步加载的代码分割
            minSize: 0, //引入的代码如果没有超过300KB 就不分割代码
            minChunks: 1, //引入类库的次数 如果小于给定值 （默认都写2） 就不分割
            maxAsyncRequests: 5, //最多代码分割几个类库 如果特别多的话 就分割5个
            maxInitialRequests: 3, //入口文件加载的时候 最多分割数
            //以上代码不需要改动 一般情况都适合
            automaticNameDelimiter: '~', //文件生成连接符 vender~ *.js
            cacheGroups: { //同步的和异步代码分割走这里
                vendors: { //如果引入的类库是node_modules里面的 就执行vendors
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10, //优先级  jquery 即符合vendors 又符合default 此时应该走哪里？ 看priority 值越高 优先级越高
                    //如果有需要babel-polyfill转义的语法 那么会打包到vender.js里面 因为走的是node_module
                    name: 'vender',  //如果写上这项 代表把所有的公共类库都打包打一个vender.js里面  如果不写的话 会生vendors开头的文件
                    reuseExistingChunk: true
                },
                default: { //如果不是Node_mmodules的类库 走这里
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true, //如果一个模块已经被打包过。如果后面还引入这个模块 就不会在继续打包
                    name: 'default'
                },
                //如果要将lodash和jquery分开 不打包一个文件里 例：
                // jqueryVendr: {
                //     test: /jquery/,
                //     priority: 100,
                //     minChunks: 1,
                //     name: 'jqu',
                //     chunks: 'all'
                // },
                // lodasVendr: {
                //     test: /lodash/,
                //     priority: 100,
                //     minChunks: 1,
                //     name: 'lodash',
                //     chunks: 'all'
                // },
            }
        }
    }

}

//import('*.js').then(data => {})  懒加载 webpack的语法   点击的时候才会加载对应的JS
//import(/* webpackPrefetch: true */ '*.js').then(data => {})   提前加载 。不需要等到点击才会加载 而是在页面加载其他的完毕后 已经空闲状态下才会加载  点击后还是会加载 不过已经走的是浏览器的缓存了