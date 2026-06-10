/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2024-12-19 17:48:46
 * @Description: 全局请求的封装
 */
import {createIo, IApiConf} from '@common/create-io'

export type TUserInfo = {
  userId: number // 1
  avatar: string | null
  securityLevel: number // 5 权限等级
  mobile: string // '15111111111'
  name: string | null
  nickname: string // '长风'
  roleCode: string // 'master'
  ctime: string // '2021-02-25 11:52:14'
  mtime: string // '2021-08-24 16:41:45'
  roleName: string // '超级管理员'
  permissionMap: {
    [key: string]: number
  }
  permissions: (string | number)[]
}

const apis: Record<'loginInfo', IApiConf> = {
  loginInfo: {
    name: '获取登陆信息',
    url: 'login_info', // 真实接口请求地址是/api/login_info
    method: 'GET',
  },
}

export default createIo(apis, 'index')
