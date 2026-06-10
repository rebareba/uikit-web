import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Link, useMatches} from 'react-router-dom'
import {Drawer, Menu, Tooltip} from 'antd'
import Icon, {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import './slider.css'
import {TreeMenu} from '../frame'
import {formatMenuData} from '../utils'

interface ISlideIndexProps {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  headerHeight?: number
  collapsedSlideWidth?: number
  slideWidth?: number
  menuData: TreeMenu[]
  selectedKeys?: string[]
  scopeSwitcher?: (collapsed: boolean) => React.ReactNode
}

const SlideIndex: React.FC<ISlideIndexProps> = ({
  collapsed,
  setCollapsed,
  headerHeight,
  collapsedSlideWidth,
  slideWidth,
  selectedKeys = [],
  menuData = [],
  scopeSwitcher,
}) => {
  // 主菜单
  const menuItems = useMemo(() => {
    return formatMenuData(
      menuData?.filter(item => !item.scopeMenu),
      false,
      selectedKeys,
    )
  }, [menuData, selectedKeys])

  // 作用域部分的菜单
  const scopeMenuItems = useMemo(() => {
    return formatMenuData(
      menuData.filter(item => item.scopeMenu),
      false,
      selectedKeys,
    )
  }, [menuData, selectedKeys])

  if (menuData.length === 0) return null

  // 主菜单
  function renderMenu() {
    return (
      <Menu
        className="bg-transparent"
        mode="inline"
        selectedKeys={selectedKeys}
        style={{
          borderRight: 0,
          width: collapsed ? collapsedSlideWidth : slideWidth,
        }}
        items={menuItems}
        inlineCollapsed={collapsed}
        defaultOpenKeys={selectedKeys}
        theme="light"
      />
    )
  }

  // 主菜单下面额外菜单
  function renderScopeSwitcherMenu() {
    return (
      <div>
        {scopeSwitcher ? scopeSwitcher?.(!!collapsed) : null}
        <Menu
          className="bg-transparent"
          mode="inline"
          selectedKeys={selectedKeys}
          style={{
            width: collapsed ? collapsedSlideWidth : slideWidth,
            borderRight: 0,
          }}
          items={scopeMenuItems}
          inlineCollapsed={collapsed}
          defaultOpenKeys={selectedKeys}
          theme="light"
        />
      </div>
    )
  }

  return (
    <div
      style={{
        width: collapsed ? collapsedSlideWidth : slideWidth,
        top: headerHeight,
      }}
      className="h-full menu-slide bg-transparent transition-all top-header fixed box-border left-0 bottom-0"
    >
      <div
        className="w-full overflow-y-auto overflow-x-hidden "
        style={{height: `calc(100% - 40px - ${headerHeight}px)`}}
      >
        {renderMenu()}
        {scopeMenuItems.length > 0 && renderScopeSwitcherMenu()}
      </div>
      <div
        className="h-[40px] w-full border-t-[1px] border-[var(--gray-border-light)] items-center flex justify-center cursor-pointer"
        onClick={() => {
          if (setCollapsed) {
            setCollapsed(!collapsed)
          }
          localStorage.setItem('collapsed', `${!collapsed}`)
        }}
      >
        <div>
          {collapsed ? (
            <MenuUnfoldOutlined className="text-base mt-[5px] cursor-pointer" />
          ) : (
            <MenuFoldOutlined className="text-base mt-[5px] cursor-pointer" />
          )}
        </div>
      </div>
    </div>
  )
}

export default SlideIndex
