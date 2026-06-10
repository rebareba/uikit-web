const pkg = require('../package.json')

// 可以新建config/config.js 来配置本地的配置项来覆盖

module.exports = {
  projectName: pkg.name,
  version: pkg.version,
  // build情况下打包输出的output.path是`dist/${config.projectName}/${config.version}`
  // 取值 . 一般是使用hash路由, //cdn.xxx.com 是资源上传到cdn的情况
  publicPathHost: '', // 最终build情况下output.publicPath对应的路径为`${config.publicHost}/${config.projectName}/${config.version}`
  port: 8765, // 端口
  analyzerPort: 8899, // 打包分析的端口 npm run analyzer
  // 接口匹配转发 devServer.proxy
  proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:3000',
      // pathRewrite: { '^/api': '' },
      changeOrigin: true, // 支持跨域请求
      secure: true,
    },
  ],
  // webpack.externals 打包忽略配置 要在index.html引入public资源
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  // 多入口情况的重定向
  rewrites: [
    // {
    //   from: /^\/admin/, to: '/admin.html'
    // },
  ],
  // 部署的服务器 在tar时候打印使用
  deployHost: '127.0.0.1',
  // 前端代码配置 动态生成config/conf.json中的数据， 也是index.html模板的数据
  nexusDir: 'https://nexus.com/repository/raw-hosted/test/1.0.0/front/demo-web/',
  nexusAuth: 'username:password',
  conf: {
    // 开发配置
    dev: {
      title: '前端代码模板',
      pathPrefix: '',
      apiPrefix: '/api',
      debug: true,
      mockAll: true, // 所有有mock数据的接口都使用success的数据
      mock: {
        // index: 'success', // 所有global 使用success的值
        // "global.loginInfo": "success", // success failed  特殊指定loginInfo方法使用的值
      },
      // 指定index.html public资源的域名 是否是cdn的资源
      publicHost: '',
      mockDelay: 1000, // mock数据的延迟时间 单位ms
      homePath: '/',
    },
    // 打包配置
    build: {
      title: '前端代码模板',
      pathPrefix: '',
      apiPrefix: '/api',
      debug: false,
      mock: {},
      // 指定public资源的域名 是否是cdn的资源
      publicHost: '',
      mockDelay: 500, // mock数据的延迟时间 单位ms
      homePath: '/',
    },
  },
}
