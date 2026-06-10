const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {ModuleFederationPlugin} = require('@module-federation/enhanced/webpack')
const isDev = process.env.NODE_ENV !== 'production'
module.exports = {
  entry: './index',
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  output: {
    path: isDev ? path.join(__dirname, 'dist') : path.join(__dirname,`dist`), // 打包结果输出路径
    clean: true,
    chunkFilename: 'chunk.[id].[name].js',
    publicPath: 'auto',

  },
  mode: isDev ? 'development' : 'production', // 开发模式,打包更加快速,省了代码优化步骤
  devtool: isDev ? 'cheap-module-source-map' : false, // 生产可以 "source-map"
  devServer: {
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    // historyApiFallback: true, // 解决history路由404问题
    historyApiFallback: {
      // 保留原有的 historyApiFallback 功能
      disableDotRule: true,
      // 添加特定路径的重写规则
      rewrites: [
        {
          from: /^\/sso\/callback$/,
          to: '/sso-callback.html'  // 将 /sso/callback 重写到 /sso-callback.html
        },
      ]
    },
    static: {
      directory: path.join(__dirname, './public'), //托管静态资源public文件夹
      publicPath: '/public', // 告诉服务器在哪个 URL 上提供 static.directory 的内容
    },
    // 支持跨域
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Method': '*',
      'Access-Control-Allow-Headers': '*',
    },
    client: {
      overlay: false,
    },
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 3303,
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
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
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: {version: 3, proposals: true},
                    targets: {
                      edge: '16',
                      ie: '9',
                      chrome: '49',
                    },
                  },
                ],
                ['@babel/preset-react', {runtime: 'automatic'}],
                '@babel/preset-typescript',
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', {legacy: true}], // 装饰器
                ['@babel/plugin-proposal-class-properties', {loose: true}], // class
                ['@babel/plugin-proposal-private-property-in-object', {loose: true}], // 私有属性
                ['@babel/plugin-proposal-private-methods', {loose: true}], // 私有方法
              ].filter(Boolean),
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
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
          'postcss-loader',
        ].filter(Boolean),
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/images/[name][ext]', // 文件输出目录和命名
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
          filename: 'static/fonts/[name][ext]', // 文件输出目录和命名
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
          filename: 'static/media/[name][ext]', // 文件输出目录和命名
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'Uikit',
      filename: 'remoteEntry.js',
      exposes: {
        './Frame': './src/Frame/index.tsx',
        './Layout': './src/Layout/index.tsx',
        './Components': './src/Components/index.tsx',
        './Utils': './src/Utils/index.tsx',
      },
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
        antd: {singleton: true},
        'react-router-dom': {singleton: true},
        'react-router-dom/': {singleton: true},
        'use-context-selector': {singleton: true},
        'ahooks': {singleton: true},
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      excludeChunks: ['sso-callback'] //排除特定 chunk
    }),
    // SSO 回调页面 HTML
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/sso-callback.html',  // 从当前目录下的 public 目录复制
          to: 'sso-callback.html'            // 输出到 dist 根目录
        },
      ]
    }),

  ].filter(Boolean),
}
