const path = require('path')
const os = require('os')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css样式
const TerserPlugin = require('terser-webpack-plugin') // 压缩js的
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {ModuleFederationPlugin} = require('@module-federation/enhanced/webpack')
// const {DtsPlugin} = require("@module-federation/dts-plugin");
// 配置文件
const config = require('.')
const {isDev, publicPath, getIPAdress, resolve} = require('../scripts/util')
const {init, getConf} = require('../scripts/webpack-init')
const {ApiMockProxyMinddleware, onProxyReq, onProxyRes} = require('../scripts/api-proxy-middleware')

init()

// 接口请求本地缓存
for (const key in config.proxy) {
  config.proxy[key] = Object.assign(config.proxy[key], {
    onProxyReq,
    onProxyRes,
  })
}

// cpu核数
const threads = os.cpus().length

module.exports = {
  entry: './src/index.tsx',
  ...(isDev
    ? {}
    : {
        externals: {
          // react: 'React',
          // 'react-dom': 'ReactDOM',
        },
      }),
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  watchOptions: {
    ignored: ['**/node_modules/**', '**/@mf-types/**'],
  },
  // 打包文件出口
  output: {
    // filename: 'static/js/[name].js', // 每个输出js的名称
    filename: 'index.[contenthash:8].js', // 每个输出js的名称
    path: isDev ? resolve('dist') : resolve(`dist/${config.projectName}/${config.version}`), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    chunkFilename: 'static/js/chunk.[id].[name].js',
    publicPath: publicPath, // 打包后文件的公共前缀路径
  },
  mode: isDev ? 'development' : 'production', // 开发模式,打包更加快速,省了代码优化步骤
  // devtool: 'eval-cheap-module-source-map', // 源码调试模式,后面会讲
  devtool: isDev ? 'cheap-module-source-map' : 'source-map', // 生产可以 "source-map"
  devServer: {
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, '../public'), //托管静态资源public文件夹
      publicPath: '/public', // 告诉服务器在哪个 URL 上提供 static.directory 的内容
    },
    // 支持跨域
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Method': '*',
      'Access-Control-Allow-Headers': '*',
    },
    client: {
      //错误显示全屏
      // overlay: true,
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    proxy: config.proxy,
    host: '0.0.0.0',
    port: config.port, // 服务端口号
    open: {
      target: `http://127.0.0.1:${config.port}`,
    },
    // 这个不是http-proxy-middleware的配置项
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }
      middlewares.unshift({
        name: 'handelMockMiddleware',
        // `path` 是可选的
        path: '/',
        middleware: ApiMockProxyMinddleware,
      })
      return middlewares
    },
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    alias: {
      '@src': resolve('src'),
      '@pages': resolve('src/pages'),
      '@store': resolve('src/store'),
      '@utils': resolve('src/utils'),
      '@i18n': resolve('src/i18n'),
      '@icons': resolve('src/icons'),
      '@assets': resolve('src/assets'),
      '@common': resolve('src/common'),
      '@hooks': resolve('src/hooks'),
    },
    // 如果用的是pnpm 就暂时不要配置这个，会有幽灵依赖的问题，访问不到很多模块。
    // modules: [path.resolve(__dirname, './node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    //   // 待会直接自己试一下
    //   cacheGroups: {
    //     libs: {
    //       name: 'chunk-libs',
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: 10,
    //       chunks: 'initial',
    //     },
    //     defaultVendors: {
    //       test: /\/src\//,
    //       name: 'rise',
    //       chunks: 'all',
    //       reuseExistingChunk: true,
    //     },
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //   },
    // },
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false, // 默认false，设置为true, 则会删除所有console.* 相关的代码。
            pure_funcs: ['console.log'], // 单纯禁用console.log
          },
        },
        // parallel: threads, // 开启多进程 大型项目可以配置 默认 true
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: [
          'thread-loader', // 开启多线程
          {
            loader: 'babel-loader',
            options: {
              // 预设执行顺序由右往左,所以先处理ts,再处理jsx
              presets: [
                //按需 polyfill 参考  https://segmentfault.com/a/1190000021188054
                [
                  // https://babeljs.io/docs/en/babel-preset-env
                  '@babel/preset-env',
                  // babel/polyfill + core-js@3
                  {
                    useBuiltIns: 'usage',
                    corejs: {version: 3, proposals: true},
                    // 执行 npx browserslist  查看版本
                    // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                    targets: {
                      // browsers: 'last 2 versions',
                      edge: '16',
                      ie: '9',
                      chrome: '49',
                    },
                  },
                ],
                ['@babel/preset-react', {runtime: 'automatic'}], //The default runtime will be switched to automatic in Babel 8.
                '@babel/preset-typescript',
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', {legacy: true}], // 装饰器
                ['@babel/plugin-proposal-class-properties', {loose: true}], // class
                ['@babel/plugin-proposal-private-property-in-object', {loose: true}], // 私有属性
                ['@babel/plugin-proposal-private-methods', {loose: true}], // 私有方法
                isDev && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                //    // styl 模块的写法格式: xxxx.module.styl
                auto: /\.module\.css$/,
                localIdentName: '[local]-[hash:5]',
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     postcssOptions: {
          //       plugins: ['autoprefixer']
          //     }
          //   }
          // },
          'postcss-loader',
        ].filter(Boolean),
      },
      {
        test: /\.less$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            // MiniCssExtractPlugin 不支持热更新
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {loader: 'css-loader', options: {modules: false}},
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true, // 选择是antd的支持
                // modifyVars: config.antdThemeConfig || {},
              },
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.styl$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                //    // styl 模块的写法格式: xxxx.module.styl
                auto: /\.module\.styl$/,
                localIdentName: '[local]-[hash:5]',
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          'stylus-loader',
        ].filter(Boolean),
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        include: [path.resolve(__dirname, '../src/assets/icons')],
        use: ['@svgr/webpack'],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: 'asset', // type选择asset
        exclude: [path.resolve(__dirname, '../src/assets/icons')],
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/images/[name][hash:8][ext]', // 文件输出目录和命名
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/fonts/[name][hash:8][ext]', // 文件输出目录和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/media/[name][hash:8][ext]', // 文件输出目录和命名
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'webapp',
      filename: 'remoteEntry.js',
      remotes: {
        'Uikit': 'Uikit@http://127.0.0.1:3303/mf-manifest.json',
        // 'Uikit': isDev? 'Uikit@http://dev-domain/uikit/mf-manifest.json': 'Uikit@/uikit/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          // eager: true, // 关键：强制同步加载，支持 loadShareSync
        }, 
        'react-dom': {
          singleton: true,
          // eager: true, // 关键：强制同步加载，支持 loadShareSync
        }, 
        antd: {
          singleton: true,
          // eager: true
        },
        'antd/': {singleton: true},
        'react-router-dom': {singleton: true},
        'react-router-dom/': {singleton: true},
        // 'use-context-selector': {
        //   singleton: true,
        // },
        // 'ahooks': {
        //   singleton: true,
        // },
        // 'ahooks/': {
        //   singleton: true,
        // },
      },
    }),
    // new DtsPlugin({
    //   // 确保输出目录存在
    //   // 禁用类型压缩（如果 zip 生成有问题）
    //   zip: true,
    //   // 强制重新生成类型
    //   force: true,
    // }),
    !isDev &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolve('public'), // 复制public下文件
            to: resolve('dist/public'), // 复制到dist/public目录中
            globOptions: {
              ignore: ['*.DS_Store'],
            },
          },
        ],
      }),
    new HtmlWebpackPlugin({
      ...getConf(),
      template: resolve(`src/index.html`), // 要处理的html // 模板取定义root节点的模板
      // inject: true, // 自动注入静态资源
      filename: 'index.html', // 处理后的html名称
      inject: 'head', // 自动注入js到什么地方
      minify: {
        // 压缩优化HTML页面
        collapseWhitespace: false, // 合并空白字符
        removeComments: true, // 移除注释
        removeAttributeQuotes: true, // 移除属性上的引号
      },
    }),
    !isDev && // build才需要
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash].css',
        //  filename: 'css/built.[chunkhash:10].css',
        chunkFilename: 'static/css/[name].[chunkhash:10].css',
        ignoreOrder: true,
      }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isDev && new ReactRefreshWebpackPlugin(),
    isDev && {
      apply: compiler => {
        // 使用 tapAsync 注册 afterCompile 钩子
        compiler.hooks.afterCompile.tapAsync('CustomPlugin', (compilation, callback) => {
          // 这里可以执行一些异步操作
          console.log(`http://${getIPAdress()}:${config.port} 或 http://127.0.0.1:${config.port}`)
          callback()
        })
      },
    },
  ].filter(Boolean),
}
