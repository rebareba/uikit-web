import {Link} from 'react-router-dom'
import React, {ReactNode} from 'react'
import type {GetProp, MenuProps} from 'antd'
import {antdIcons} from './components/antd-icons'
import {TreeMenu} from './frame'

type MenuItem = GetProp<MenuProps, 'items'>[number]

const getMenuTitle = (menu: TreeMenu) => {
  if (menu.children?.length || !menu.link) {
    return menu.label
  }
  if (/^https?:\/\//.test(menu.link)) {
    return (
      <a href={menu.link} target="_blank" rel="noopener noreferrer">
        {menu.label}
      </a>
    )
  }
  return <Link to={menu.link || ''}>{menu.label}</Link>
}
export const getIcon = (icon: React.ReactNode): ReactNode => {
  if (typeof icon === 'string') {
    if (icon.startsWith('data:')) {
      // base64图片
      return <img src={icon} className="w-[18px] h-[18px]" alt="" />
    }
    return antdIcons[icon as string] && React.createElement(antdIcons[icon])
  }
  return icon
}

export const formatMenuData = (
  menus: TreeMenu[],
  isHeader = false,
  selectedKeys: string[] = [],
): MenuItem[] => {
  return menus
    .filter(menu => (isHeader ? !menu.headerHide : true)) // 是否需要掩藏头部菜单
    .map(menu => {
      const isSelected = selectedKeys.includes(menu.key)
      const targetIcon = isSelected && menu.highlightIcon ? menu.highlightIcon : menu.icon

      return {
        key: menu.key,
        label: getMenuTitle(menu),
        icon: targetIcon && getIcon(targetIcon),
        children: menu.children?.length
          ? formatMenuData(menu.children || [], isHeader, selectedKeys)
          : null,
        disabled: menu.children?.length ? undefined : menu.disabeld || !menu.link,
      }
    })
}
