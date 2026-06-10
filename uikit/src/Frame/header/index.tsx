import React, {useMemo} from 'react'
import {Menu} from 'antd'
import HeaderTitle from './header-title'
import {TreeMenu} from '../frame'
import {formatMenuData} from '../utils'
import './index.css'

export interface HeaderProps {
  title: React.ReactNode
  logoIcon?: React.ReactNode
  headerHeight: number
  extra?: React.ReactNode
  selectedKeys: string[]
  menuData?: TreeMenu[]
  darkMode: boolean
}
const Header: React.FC<HeaderProps> = ({
  title,
  logoIcon,
  headerHeight,
  extra,
  selectedKeys = [],
  menuData = [],
  darkMode,
}) => {
  const menuItems = useMemo(() => {
    return formatMenuData(menuData, true)
  }, [menuData])
  return (
    <div
      style={{zIndex: 998, height: headerHeight}}
      className="flex basis-[48px] items-center px-0 gap-[16px] fixed top-0 right-0 left-0 bg-[var(--brand-primary)]"
    >
      <HeaderTitle title={title} logoIcon={logoIcon} />
      {menuItems.length > 0 && (
        <div className="flex-[5_1_0%] overflow-hidden h-full">
          <Menu
            className="bg-transparent h-full header-dark-menu"
            style={{borderBottom: 0}}
            selectedKeys={selectedKeys}
            mode="horizontal"
            items={menuItems}
            theme="dark"
          />
        </div>
      )}
      {extra}
    </div>
  )
}

export default Header
