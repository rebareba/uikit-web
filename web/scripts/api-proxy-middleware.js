const fs = require('fs')
const PassThrough = require('stream').PassThrough;
const path = require('path')
const API_CACHE_DIR = path.join(__dirname, '../api-cache')
const {jsonParse, getBody} = require('./util')
const {getMockData, getConf} = require('./webpack-init')

try {
  fs.mkdirSync(API_CACHE_DIR, {recursive: true})
} catch (e) {}

// 缓存请求和响应数据
const reqResCache = async (filePath, req, res) => {
  const {method, url, query, path: reqPath} = req;
  let resBody = await getBody(res);
  resBody = jsonParse(resBody)
  let data = {}
  if (fs.existsSync(filePath)) {
    data = jsonParse(fs.readFileSync(filePath).toString())
  }
  const cacheObj = {
    date: new Date().toString(),
    method,
    path: reqPath,
    url,
    resHeader: res.headers,
    reqHeader: req.headers,
    query,
    reqBody: jsonParse(req.reqBody),
    resBody,
  }
  if (resBody.success === false) {
    data.failed = cacheObj
  } else {
    data.success = cacheObj
  }
  fs.writeFile(filePath, JSON.stringify(data, '', '\t'), (err) => {
    err && console.log('writeFile', err)
  })
}



// 这里只处理匹配请求头mock
exports.ApiMockProxyMinddleware = async function(req, res, next) {
  // https://webpack.docschina.org/configuration/dev-server/#devserversetupmiddlewares
  const {'mock-method': mockMethod, 'mock-key': mockKey, 'content-type': contentType} = req.headers
  if (mockMethod && mockKey) {
    const mockData = await getMockData(mockMethod, mockKey)
    if (mockData) {
      console.log('使用本地mock数据作为响应数据', mockMethod, mockKey)
      res.append('isMock', 'yes')
      const config = getConf()
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, config.mockDelay || 1000)
      })
      res.send(mockData)
      return
    }
  }
  await next()
}

// proxyReq, req, res
exports.onProxyReq = async (_, req, res) => {
  const {'mock-method': mockMethod, 'mock-key': mockKey, 'content-type': contentType} = req.headers
  if (mockMethod && mockKey) {
    req.mockKey = mockKey
    req.mockMethod = mockMethod
    if (!(contentType || '').startsWith('multipart')) {
      req.reqBody = await getBody(req)
    } else {
      req.reqBody = '{"file": "文件"}'
    }
  }
},

// proxyRes, req, res
exports.onProxyRes =  async (res, req) => {
  const {mockKey, mockMethod} = req
  if (mockKey && mockMethod && res.statusCode === 200) {
    const filePath = path.join(API_CACHE_DIR, `${mockKey}.${mockMethod}.json`)
    console.log('缓存请求和响应数据', filePath)
    await reqResCache(filePath, req, res)
  }
}




