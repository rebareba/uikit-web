/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2024-12-19 17:52:06
 * @Description: 获取mock数据
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockData: Record<string, any> = {}
try {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const data = require('../../mock.json')
  Object.assign(mockData, data)
} catch (e) {
  /* empty */
}

export default mockData
