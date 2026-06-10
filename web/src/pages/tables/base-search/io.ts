import React from 'react'

import {createIo, IApiConf} from '@common/create-io'
import {createIoPro} from 'Uikit/Utils'

export type TVisible = '' | 'AddModifyModal' | 'DetailModal'
export interface IItem {
  id: React.Key
  isDeleted: boolean
  roleType: number
  nickName: string
  email: string
  phone: string
  content: string
  createdBy: number
  updatedBy: number
  createUser: string
  updateUser: string
  createTime: number
  updateTime: number
  avatar: string
}

// 接口定义
const apis = {
  getPageList: {
    name: '分页获取提示词列表',
    url: 'prompts',
    method: 'POST',
  },
  createData: {
    name: '添加提示词',
    method: 'POST',
    url: 'prompts',
  },
  updateData: {
    name: '修改提示词',
    method: 'PUT',
    url: 'prompts/:promptId',
  },
  deleteData: {
    name: '删除提示词',
    method: 'DELETE',
    url: 'prompts/:promptId',
  },
  getDetail: {
    name: '获取提示词详情',
    method: 'GET',
    url: 'prompts/:promptId',
  },
} as const satisfies Record<string, IApiConf>

const io = createIo(apis, 'table-base-search')

export const ioPro = createIoPro(io)

export default io
