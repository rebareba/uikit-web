import React, {forwardRef, useImperativeHandle, useRef} from 'react'
import {Outlet} from 'react-router-dom'
import TabsLayout from './TabsLayout'
import {TabsLayoutMethods} from '../frame'

interface Props {
  collapsed: boolean
  // 是否使用tab缓存
  showKeepAliveTab: boolean
  hasSiderMenu: boolean
  slideWidth: number
  collapsedSlideWidth: number
  cacheKey?: string
  matchedKey?: string
  headerHeight: number
  enableDetailPageMultiTabs: boolean
  // 需要关闭前置处理的routerPath
  preCloseRouterPaths?: string[]
  // 关闭前置处理的函数
  beforeTabClose?: () => Promise<void> | void
}

const Content = forwardRef<TabsLayoutMethods, Props>(
  (
    {
      collapsed,
      collapsedSlideWidth,
      slideWidth,
      headerHeight,
      showKeepAliveTab,
      hasSiderMenu = true,
      cacheKey,
      matchedKey = '',
      enableDetailPageMultiTabs,
      preCloseRouterPaths,
      beforeTabClose,
    },
    ref,
  ) => {
    const tabsLayoutRef = useRef<TabsLayoutMethods>(null)
    // 暴露方法给外部
    useImperativeHandle(ref, () => ({
      closeTab: () => tabsLayoutRef.current?.closeTab(),
    }))

    const marginLeft = collapsed ? collapsedSlideWidth : slideWidth
    return (
      <div
        className="transition-all"
        style={{
          background: showKeepAliveTab ? '' : 'var(--gray-fill-light)',
          marginLeft: hasSiderMenu ? marginLeft : 0,
          overflow: 'auto',
          marginTop: headerHeight,
          height: `calc(100vh - ${headerHeight}px)`,
          width: `calc(100vw - ${hasSiderMenu ? (collapsed ? collapsedSlideWidth : slideWidth) : 0}px)`,
        }}
      >
        {showKeepAliveTab && hasSiderMenu ? (
          <TabsLayout
            ref={tabsLayoutRef}
            headerHeight={headerHeight}
            cacheKey={cacheKey}
            matchedKey={matchedKey}
            enableDetailPageMultiTabs={enableDetailPageMultiTabs}
            preCloseRouterPaths={preCloseRouterPaths}
            beforeTabClose={beforeTabClose}
          />
        ) : (
          <Outlet />
        )}
      </div>
    )
  },
)
export default Content
