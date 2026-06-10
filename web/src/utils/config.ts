/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2024-12-19 18:01:03
 * @Description: 获取全局配置 可以通过模板在window全局配置进行覆盖
 */

interface IType {
  pathPrefix: string
  apiPrefix: string
  debug: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
const configData: IType = {
  pathPrefix: '',
  apiPrefix: '',
  debug: false,
}
try {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const data = require('../../config/conf.json') // 这个是动态生成的
  Object.assign(configData, data)
} catch (e) {
  /* empty */
}

export default Object.assign(configData, window.config)
