const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const assetsDir = 'static'
// const resolve = dir => path.join(__dirname, dir)
// posix兼容方式处理路径
const posixJoin = _path => path.posix.join(assetsDir, _path)


const lastVersion = new Date().getTime()
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
    publicPath: process.env.VUE_APP_BASE_URL || '/',
    lintOnSave: false,
    devServer: {
        port: '8083',
    },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
    },
   
    configureWebpack: config => {
        config.resolve.extensions = ['.js', '.vue', '.json']
        if (isProd) {
          config.plugins.push(
            // 启用gzip
              new CompressionWebpackPlugin({
                test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
              })
          )
          config.plugins.push(
            //压缩代码，生产环境自动删除console
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        drop_console: true, // console
                        drop_debugger: false,
                        pure_funcs: ['console.log'] // 移除console
                    }
                }
            })
          );
        
        }
        //入口文件
        config.entry.app = ['babel-polyfill', './src/main.js'];
    },

    chainWebpack: config => {
        /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         */
        config.plugins
        .delete('prefetch')
        .delete('preload')
        // config.resolve.alias
        //   .set('vue$', 'vue/dist/vue.esm.js')
        //   .set('@', resolve('src'))
        // 清除警告
            
        config.when(isProd, config =>
            // 生产环境js增加版本号
            config.output
            .set('filename', posixJoin(`js/${lastVersion}-[name].[chunkhash].js`))
            .set('chunkFilename', posixJoin(`js/${lastVersion}-[id].[chunkhash].js`))
        )
  }
}