
// 需要压缩一些私有变量,需要使用特别配置
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
// 导出模块
module.exports = {
    // 产品模式
　　mode: 'production',
    // 入口文件
　　entry: './src/main.tsx',
　　// entry: './test/main.ts',
    // UglifyJsPlugin 特有配置 https://github.com/mishoo/UglifyJS2#minify-options 英文文档
    optimization: {
        minimizer: [new UglifyJsPlugin({
            // 开启缓存
            cache:true,
            // 使用多进程并行运行和文件缓存来提高构建速度
            parallel:true,
            // 包含的文件
            // include:RegExp|Array<RegExp>,
            // 忽略的文件
            // exclude:RegExp|Array<RegExp>,
            // 过滤函数,可以控制一些文件不用过滤和丑化
            // chunkFilter: (chunk) => {
            //     // Exclude uglification for the `vendor` chunk
            //     if (chunk.name === 'vendor') { // 表示 vendor 模块不用过滤丑化
            //       return false;
            //     }
            //     // console.log('chunk',chunk);
            //     // 默认就是压缩丑化
            //     return true;
            // },
            // 额外配置
            uglifyOptions:{
                mangle:{
                    // 关于对象、类(属性和方法)(静态和非静态)
                    properties:{ // 如果注释以下配置,达到0配置,则会压缩所有的属性,极度丑化压缩
                        // 仅修改未加引号的属性名称
                        keep_quoted:true,
                        // 将RegExp文字传递给仅匹配正则表达式的属性名称
                        regex:/^_/,
                        // 不要修改 reserved 数组中列出的属性名称 ['_set','_get']
                        reserved:[]
                    }
                },
                // 输出
                output:{
                    // 将字符串中文转成 Unicode 
                    ascii_only:true
                }
            }
        })],
    },
    // 使用到的编译模块
　　module: {
　　　　rules: [{
　　　　　　test: /\.tsx?$/,
　　　　　　// ts-loader是官方提供的处理tsx的文件
　　　　　　use: 'ts-loader',
　　　　　　exclude: /node_modules/
　　　　}]
　　},
    resolve:{ // 特别重要,要不然就找不到文件
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    // 输出配置
　　output: {
　　　　filename: 'wen.jssdk.js',
　　　　path: path.resolve(__dirname, 'dist')
　　},
    // 开发需要的服务器,不能达到实时编译,只能编译出来使用此服务进行引用该服务器的 js 产品文件
    devServer: { 
        //webpack-dev-server配置路径
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        host: '0.0.0.0',
        hot: true,
        open: 'Google Chrome',
        allowedHosts: [
            'wen.io',
            '*'
        ]
        
    }

}
