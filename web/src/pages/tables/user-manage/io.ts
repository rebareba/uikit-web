import React from 'react'

import {createIo, IApiConf, IFCall} from '@common/create-io'
import {createIoPro} from 'Uikit/Utils'

// 接口定义
const apis = {
  getPageList: {
    name: '分页获取用户列表',
    url: 'prompts',
    method: 'POST',
  },
  createData: {
    name: '添加用户',
    method: 'POST',
    url: 'prompts',
  },
  updateData: {
    name: '修改用户',
    method: 'PUT',
    url: 'prompts/:promptId',
  },
  deleteData: {
    name: '删除用户',
    method: 'DELETE',
    url: 'prompts/:promptId',
  },
  getDetail: {
    name: '获取用户详情',
    method: 'GET',
    url: 'prompts/:promptId',
  },
  getDepartmentList: {
    name: '获取部门列表',
    method: 'GET',
    url: 'department/list',
  },
  createDepartment: {
    name: '创建部门',
    method: 'POST',
    url: 'department/',
  },
  updateDepartment: {
    name: '更新部门',
    method: 'PUT',
    url: 'department/:id',
  },
  deleteDepartment: {
    name: '删除部门',
    method: 'DELETE',
    url: 'department/:id',
  },
  createUser: {
    name: '添加用户',
    method: 'POST',
    url: 'user/',
  },
  updateUser: {
    name: '修改用户',
    method: 'PUT',
    url: 'user/:userId',
  },
  resetPasswd: {
    name: '重置密码',
    method: 'PUT',
    url: 'user/passwd',
  },
  deleteUser: {
    name: '删除用户',
    method: 'DELETE',
    url: 'user/:userId',
  },
  transferOwner: {
    name: '转移所有者',
    method: 'PUT',
    url: 'user/transfer-owner',
  },
  getUserDetail: {
    name: '获取用户详情',
    method: 'GET',
    url: 'user/:userId',
  },
  getAllRoles: {
    name: '获取所有角色',
    method: 'GET',
    url: 'role/all',
  },
  grantRole: {
    name: '授权角色',
    method: 'POST',
    url: 'user/role/grant',
  },
} as const satisfies Record<string, IApiConf>

const io = createIo(apis, 'table-user-manage')

export const ioPro = createIoPro(io)

export default io
