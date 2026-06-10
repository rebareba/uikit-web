/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2023-04-18 21:08:24
 * @Description: 全局请求的封装
 */
import {createIo, IApiConf} from '@common/create-io'

const apis = {
  loginInfo: {
    name: '获取登陆信息',
    url: 'login_info', // 真实接口请求地址是/api/login_info
    method: 'GET',
  },
  logout: {
    name: '退出登录',
    method: 'POST',
    url: 'logout',
  },
} as const satisfies Record<string, IApiConf>

const io = createIo(apis, 'global')

export default io
