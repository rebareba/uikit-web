/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from 'react'
import {useLocation, useMatches, useOutlet} from 'react-router-dom'

interface MatchRouteType {
  // 菜单名称
  title: string
  // tab对应的url
  pathname: string
  // 要渲染的组件
  children: any
  // 路由，和pathname区别是，详情页 pathname是 /:id，routePath是 /1
  routePath: string
  // 图标
  icon?: string
  // 固定不变的path 例如相同的详情页: /:id 不会变成 /1  /2  只保存/:id(用在处理详情页打开多页签以后, 切换详情数据不变问题)
  invariablePath?: string
}

export function useMatchRoute(enableDetailPageMultiTabs: boolean): MatchRouteType | undefined {
  // 获取路由组件实例
  const children = useOutlet()
  // 获取所有路由
  const matches = useMatches()
  // 获取当前url
  const {pathname} = useLocation()

  const [matchRoute, setMatchRoute] = useState<MatchRouteType | undefined>()

  // 监听pathname变了，说明路由有变化，重新匹配，返回新路由信息
  useEffect(() => {
    console.log('pathname', pathname)
    // 获取当前匹配的路由
    const lastRoute = matches[matches.length - 1]

    if (!lastRoute?.handle) return

    console.log('lastRoute', lastRoute)

    setMatchRoute({
      title: (lastRoute?.handle as any)?.name,
      pathname,
      children,
      routePath: enableDetailPageMultiTabs ? lastRoute?.pathname : (lastRoute?.handle as any)?.path,
      icon: (lastRoute?.handle as any)?.icon,
      invariablePath: (lastRoute?.handle as any)?.path,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  // console.log('matchRoute', matchRoute)

  return matchRoute
}
