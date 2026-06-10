import {DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined} from '@ant-design/icons'
import {Dropdown, MenuProps} from 'antd'
import React from 'react'
import {IDepartmentDTO, TDepartmentNode} from '../types'

interface CustomTitleProps {
  title: React.ReactNode
  node: TDepartmentNode
  item: IDepartmentDTO
  onAddChild: (item: IDepartmentDTO, node?: TDepartmentNode) => void
  onEdit: (item: IDepartmentDTO, node?: TDepartmentNode) => void
  onDelete: (item: IDepartmentDTO, node?: TDepartmentNode) => void
}
// 自定义title
const CustomTitle = ({title, node, item, onAddChild, onEdit, onDelete}: CustomTitleProps) => {
  const items = [
    {
      key: 'addChild',
      label: '新建子部门',
      icon: <PlusOutlined />,
    },
    {
      key: 'edit',
      label: '修改',
      icon: <EditOutlined />,
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
    },
  ]

  const onClick: MenuProps['onClick'] = e => {
    e.domEvent.stopPropagation()
    const {key} = e
    switch (key) {
      case 'addChild':
        onAddChild(item, node)
        break
      case 'edit':
        onEdit(item, node)
        break
      case 'delete':
        onDelete(item, node)
        break
      default:
        break
    }
  }

  return (
    <div className="flex items-center justify-between w-full group">
      <span className="flex-1 truncate">{title}</span>
      <div className="relative min-w-[24px]">
        <span className="text-sm min-w-[24px] text-right group-hover:opacity-0 transition-opacity duration-150 block">
          {item.userCount || 0}
        </span>
        <Dropdown menu={{items, onClick}} trigger={['click']}>
          <MoreOutlined
            style={{fontSize: 18}}
            className="cursor-pointer opacity-0 group-hover:opacity-100 hover:text-primary transition-all duration-150 absolute top-0 right-[-5px] text-sm text-right flex items-center justify-end h-full"
            onClick={e => e.stopPropagation()}
          />
        </Dropdown>
      </div>
    </div>
  )
}

export default CustomTitle
