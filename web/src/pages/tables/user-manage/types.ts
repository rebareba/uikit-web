import {TreeDataNode} from 'antd'

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
  uid?: number
  userCode?: string
  passwordChangeTime?: string
  expireTime?: string
  isActive?: boolean
  isLocked?: boolean
  userName?: string
  nickname?: string
  mobile?: string
  allowDelete?: boolean
  isTenantOwner?: true
  departmentId?: string
  tenantId?: number
}

export interface IDepartmentDTO {
  createdBy?: number
  updatedBy?: number
  createTime?: string
  updateTime?: string
  invalid?: number
  departmentId?: number | undefined
  departmentName?: string
  parentDepartmentId?: number | null
  departmentOwner?: number
  tenantId?: number
  userCount?: number
}

export interface IRoleDTO {
  invalid?: number
  roleId?: number
  roleCode?: string
  roleName?: string
  roleProfile?: string
  roleType?: string
  isSystem?: boolean
  isOnly?: boolean
  mutexRoles?: {roleId: number; roleName: string}[]
  createdByName?: string
  isOperable?: boolean
  grantId?: number
  isActive?: boolean
  createTime: number
  updateTime: number
}

// 增强的树节点类型
export type TDepartmentNode = {
  key: string
  title: React.ReactNode
  selectable?: boolean
  isLeaf?: boolean
  children?: TDepartmentNode[]
  parentIds: string[] // 仅祖先节点 id（不包含自己）
  childrenIds: string[] // 仅后代节点 id（不包含自己）
  // 新增：存储原始部门名称，用于搜索
  departmentName: string
} & TreeDataNode
