/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2024-10-21 11:44:39
 * @Description: webpack的脚本，动态生成mock.json和config/conf.json, 并且监听config目录下的config
 */
const path = require('path')
const fs = require('fs')
const {syncWalkDir, isDev} = require('./util')

let confGlobal = {}
let mockJsonData = {}
exports.getConf = () => confGlobal
exports.getMockJson = () => mockJsonData

/**
 * 初始化项目的配置 动态生成mock.json和config/conf.json
 * @param {string} env  dev|build
 */
exports.init = () => {
  delete require.cache[require.resolve('../config')]
  const config = require('../config')
  const confJson = isDev ? config.conf.dev : config.conf.build
  confGlobal = confJson
  // 1.根据环境变量来生成
  fs.writeFileSync(path.join(__dirname, '../config/conf.json'), JSON.stringify(confGlobal, null, '\t'))
  buildMock(confJson)
}

// 请求获取缓存数据
exports.getMockData =  (mockMethod, mockKey) => {
  let mockType // mock值的类型
  if (confGlobal.mockAll || confGlobal.mock[mockKey]) {
    mockType = confGlobal.mock[mockKey] || 'success'
  } else if (confGlobal.mock[`${mockKey}.${mockMethod}`]) {
    mockType = confGlobal.mock[`${mockKey}.${mockMethod}`]
  }
  // 这块可以优化后面监听读取文件就可以
  if (mockType && mockJsonData[mockKey] && mockJsonData[mockKey][mockMethod]) {
    return mockJsonData[mockKey][mockMethod]
  }
  return null
}


// 生成mock文件数据
const buildMock = (conf) => {
  // 2.动态生成mock数据 读取src文件夹下面所有以 -mock.json结尾的文件 存储到io/index.json文件当中
  const mockJson = {}
  const mockFiles = syncWalkDir(path.join(__dirname, '../src'), (file) => /-mock.json$/.test(file))
  console.log('build mocks: ->>>>>>>>>>>>>>>>>>>>>>>')
  mockFiles.forEach((filePath) => {
    const p = path.parse(filePath)
    const mockKey = p.name.substr(0, p.name.length - 5)
    console.log(mockKey, path.relative(path.join(__dirname, '../src'), filePath))
    if (mockJson[mockKey]) {
      console.error(`有相同的mock文件名称${p.name} 存在`, filePath)
    }
    delete require.cache[require.resolve(filePath)]
    mockJson[mockKey] = require(filePath)
  })
  // 如果是打包环境， 最小化mock资源数据
  const mockMap = conf.mock || {}
  const buildMockJson = {}
  // 如果是全部mock的情况
  if (conf.mockAll) {
    Object.keys(mockJson).forEach((key) => {
      buildMockJson[key] = {}
      Object.keys(mockJson[key]).forEach((key2) => {
        if (mockJson[key][key2]['success']) {
          buildMockJson[key][key2] = mockJson[key][key2]['success']
        }
        const mockType = mockMap[`${key}.${key2}`] || mockMap[`${key}`]
        // 如果配置中有定义 就使用配置中的
        if (mockType && mockJson[key][key2][mockType]) {
          buildMockJson[key][key2] = mockJson[key][key2][mockType]
          // 如果有定义却未找到则不使用mock
        } else if (mockType) {
          delete buildMockJson[key][key2]
        }
      })
    })
  } else {
    Object.keys(mockMap).forEach((key) => {
      const [name, method] = key.split('.')
      if (name && method) {
        if (mockJson[name] && mockJson[name][method] && mockJson[name][method][mockMap[key]]) {
          if (!buildMockJson[name]) buildMockJson[name] = {}
          if (!buildMockJson[name][method]) buildMockJson[name][method] = {}
          buildMockJson[name][method] = mockJson[name][method][mockMap[key]]
        } else if (mockJson[name] && mockJson[name][method] && buildMockJson[name]) {
          delete buildMockJson[name][method]
        }
      } else if (mockJson[name]) {
        // 如果只有name没有method
        if (!buildMockJson[name]) buildMockJson[name] = {}
        Object.keys(mockJson[name]).forEach((key) => {
          if (mockJson[name][key][mockMap[name]] && !buildMockJson[name][key]) {
            buildMockJson[name][key] = mockJson[name][key][mockMap[name]]
          }
        })
      }
    })
  }

  mockJsonData = buildMockJson
  fs.writeFileSync(path.join(__dirname, '../mock.json'), JSON.stringify(buildMockJson, null, '\t'))
}







// 监听配置文件目录下的config.js和config_default.js
const confPath = path.join(__dirname, '../config')

if (process.env.NODE_ENV === 'development') {
  fs.watch(confPath, async (event, filename) => {
    if (filename === 'config.js' || filename === 'config_default.js') {
      delete require.cache[path.join(confPath, filename)]
      delete require.cache[require.resolve('../config')]
      const config = require('../config')
      const confJson = config.conf.dev
      if (JSON.stringify(confJson) !== JSON.stringify(confGlobal)) {
        this.init()
      }
    }
  })
}


