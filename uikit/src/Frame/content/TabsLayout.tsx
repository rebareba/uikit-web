/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, forwardRef, useImperativeHandle} from 'react'
import {arrayMove} from '@dnd-kit/sortable'
import {MenuItemType} from 'antd/es/menu/interface'
import {Dropdown} from 'antd'
import {useNavigate} from 'react-router-dom'
import {KeepAliveTabContext} from './tabs-context'
import {KeepAliveTab, useTabs} from './hooks/use-tabs'
import DraggableTab from './components/draggable-tab'
import {getIcon} from '../utils'
import {TabsLayoutMethods} from '../frame'

enum OperationType {
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSE_OTHER = 'close-other',
}

interface TabsLayoutProps {
  headerHeight: number
  cacheKey?: string
  matchedKey?: string // 后续过滤分组使用的
  enableDetailPageMultiTabs: boolean // 详情页是否显示多页签
  // 需要关闭前置处理的routerPath
  preCloseRouterPaths?: string[]
  // 关闭前置处理的函数
  beforeTabClose?: () => Promise<void> | void
}

const TabsLayout = forwardRef<TabsLayoutMethods, TabsLayoutProps>(
  (
    {
      headerHeight,
      cacheKey,
      matchedKey = '',
      enableDetailPageMultiTabs,
      preCloseRouterPaths,
      beforeTabClose,
    },
    ref,
  ) => {
    const {
      activeTabRoutePath,
      tabs = [],
      closeTab,
      refreshTab,
      closeOtherTab,
      performCloseTab,
      setTabs,
    } = useTabs(cacheKey, enableDetailPageMultiTabs, preCloseRouterPaths, beforeTabClose)

    // 暴露方法给外部
    useImperativeHandle(ref, () => ({
      closeTab: () => performCloseTab(),
    }))

    const navigate = useNavigate()

    const menuItems: MenuItemType[] = useMemo(
      () =>
        [
          {
            label: '刷新',
            key: OperationType.REFRESH,
          },
          tabs.length <= 1
            ? null
            : {
                label: '关闭',
                key: OperationType.CLOSE,
              },
          tabs.length <= 1
            ? null
            : {
                label: '关闭其他',
                key: OperationType.CLOSE_OTHER,
              },
        ].filter(o => o !== null) as MenuItemType[],
      [tabs],
    )

    const menuClick = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({key, domEvent}: any, tab: KeepAliveTab) => {
        domEvent.stopPropagation()

        if (key === OperationType.REFRESH) {
          refreshTab(tab.routePath)
        } else if (key === OperationType.CLOSE) {
          closeTab(tab.routePath)
        } else if (key === OperationType.CLOSE_OTHER) {
          closeOtherTab(tab.routePath)
        }
      },
      [closeOtherTab, closeTab, refreshTab],
    )

    const renderTabTitle = useCallback(
      (tab: KeepAliveTab) => {
        return (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: e => menuClick(e, tab),
            }}
            trigger={['contextMenu']}
            onOpenChange={open => {
              if (open) {
                navigate(tab.pathname)
              }
            }}
          >
            <div className="flex gap-[6px]" style={{margin: '-12px 0', padding: '12px 0'}}>
              {tab.title}
            </div>
          </Dropdown>
        )
      },
      [menuClick, navigate, menuItems],
    )

    const tabItems = useMemo(() => {
      return tabs.map(tab => {
        return {
          key: tab.routePath,
          label: renderTabTitle(tab),
          children: (
            <div
              key={tab.key}
              className="overflow-y-auto"
              style={{
                background: 'var(--gray-fill-light)',
                height: `calc(100vh - ${headerHeight + 40}px)`,
              }}
            >
              {tab.children}
            </div>
          ),
          closable: tabs.length > 1, // 剩最后一个就不能删除了
        }
      })
    }, [headerHeight, renderTabTitle, tabs])

    const onTabsChange = useCallback(
      (tabRoutePath: string) => {
        if (enableDetailPageMultiTabs) {
          navigate(tabRoutePath)
        } else {
          const tab = tabs.find(t => t.routePath === tabRoutePath)
          if (tab && tab.pathname) {
            navigate(tab.pathname)
          }
        }
      },
      [navigate, tabs],
    )

    const onTabEdit = (
      targetKey: React.MouseEvent | React.KeyboardEvent | string,
      action: 'add' | 'remove',
    ) => {
      if (action === 'remove') {
        closeTab(targetKey as string)
      }
    }

    const keepAliveContextValue = useMemo(
      () => ({
        closeTab,
        closeOtherTab,
        refreshTab,
      }),
      [closeTab, closeOtherTab, refreshTab],
    )

    return (
      <KeepAliveTabContext.Provider value={keepAliveContextValue}>
        <DraggableTab
          activeKey={activeTabRoutePath}
          items={tabItems}
          type="editable-card"
          onChange={onTabsChange}
          hideAdd
          onEdit={onTabEdit}
          size="small"
          onDragEnd={({activeIndex, overIndex}) => {
            setTabs(arrayMove(tabs, activeIndex as number, overIndex as number))
          }}
        />
      </KeepAliveTabContext.Provider>
    )
  },
)

export default TabsLayout
