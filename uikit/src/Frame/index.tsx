import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react'
import '../index.css'
import Content from './content'
import Header from './header'
import Slider from './slider'
import {IMenu, TabsLayoutMethods} from './frame'
import {usePCScreen} from './hooks/use-pc-screen'
import {useMatchMenu} from './hooks/use-match-menu'

export interface FrameLayoutMethods extends TabsLayoutMethods {}

export interface IFrameTabProps {
  defaultCollapsed?: boolean
  title?: string
  logo?: React.ReactNode
  menuData: IMenu[]
  // 是否使用tab缓存
  defaultShowKeepAliveTab?: boolean
  headerExtra?: React.ReactNode
  cacheKey?: string
  headerHeight?: number
  slideWidth?: number
  collapsedSlideWidth?: number
  // 详情页是否支持打开多页签
  enableDetailPageMultiTabs?: boolean
  // 暗黑主题
  darkMode?: boolean
  // 需要关闭前置处理的routerPath
  preCloseRouterPaths?: string[]
  // 关闭前置处理的函数
  beforeTabClose?: () => Promise<void> | void
  /**
   * 作用域切换器
   * 接收 collapsed 状态，返回对应的 ReactNode
   */
  scopeSwitcher?: (collapsed: boolean) => React.ReactNode
}

const FrameName = forwardRef<TabsLayoutMethods, IFrameTabProps>(
  (
    {
      defaultCollapsed = localStorage.getItem('collapsed') === 'true',
      title = '',
      logo,
      menuData = [],
      headerHeight = 48,
      collapsedSlideWidth = 48,
      slideWidth = 200,
      defaultShowKeepAliveTab = true,
      headerExtra,
      cacheKey = 'keepAliveTabs',
      enableDetailPageMultiTabs = true,
      darkMode = true,
      preCloseRouterPaths,
      beforeTabClose,
      scopeSwitcher,
    },
    ref,
  ) => {
    const contentRef = useRef<TabsLayoutMethods>(null)
    // 暴露方法给外部
    useImperativeHandle(ref, () => ({
      closeTab: () => contentRef.current?.closeTab(),
    }))

    const [collapsed, setCollapsed] = useState(defaultCollapsed)
    const isPC = usePCScreen()
    const logoIcon = logo || ''

    const {matchedRoute, siderMenu, selectedKeys, headerMenu, matchedKey, showKeepAliveTab} =
      useMatchMenu(menuData, defaultShowKeepAliveTab)

    const hasSiderMenu = siderMenu.length > 0

    return (
      <div className="overflow-hidden">
        <Header
          logoIcon={logoIcon}
          title={title}
          headerHeight={headerHeight}
          selectedKeys={selectedKeys}
          menuData={headerMenu}
          extra={headerExtra}
          darkMode={darkMode}
        />
        <Slider
          {...{
            collapsed,
            setCollapsed,
            selectedKeys,
            menuData: siderMenu,
            isPC,
            headerHeight,
            slideWidth,
            collapsedSlideWidth,
            scopeSwitcher,
          }}
        />
        <Content
          {...{
            hasSiderMenu,
            matchedRoute,
            showKeepAliveTab,
            collapsed,
            slideWidth,
            collapsedSlideWidth,
            headerHeight,
            cacheKey,
            matchedKey,
            enableDetailPageMultiTabs,
            preCloseRouterPaths,
            beforeTabClose,
          }}
          ref={contentRef}
        />
      </div>
    )
  },
)

export default FrameName
