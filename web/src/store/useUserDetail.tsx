import {useRequest} from 'ahooks'
import {useEffect, useState} from 'react'
import {useNavigate, RouteObject} from 'react-router-dom'
import {Error404Page} from 'Uikit/Components'
import {pages} from '@pages/index'
import {router} from '../router'

import io from './io'
import {useUserStore} from './user'
import {menuData as defaultMenuData} from './menu'
import {MenuData, TUserInfo} from './global'

// 获取用户登录信息
export function useUserDetail() {
  const [loading, setLoading] = useState(true)
  const {setCurrentUser} = useUserStore()
  const {data, loading: requestLoading, error} = useRequest(io.loginInfo)

  useEffect(() => {
    if (!data) return
    const currentUserDetail = data.content as TUserInfo

    function findNodeByPath(routes: RouteObject[], path: string) {
      for (let i = 0; i < routes.length; i += 1) {
        const element = routes[i]

        if (element.path === path) return element

        findNodeByPath(element.children || [], path)
      }
    }
    function replaceRoutes(parentPath: string, routes: RouteObject[]) {
      if (!parentPath) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.routes.push(...(routes as any))
        return
      }

      const curNode = findNodeByPath(router.routes, parentPath)

      if (curNode) {
        curNode.children = routes
      }
    }
    currentUserDetail.menuData = currentUserDetail.menuData || defaultMenuData
    const routes: MenuData[] = (currentUserDetail.menuData as MenuData[]).filter(
      menu => menu.routePath && menu.filePath && !menu.disabeld,
    )

    replaceRoutes('*', [
      ...routes.map(menu => {
        return {
          id: `${menu.id}`,
          path: `/*${menu.routePath}`,
          Component: pages[menu.filePath!] ? pages[menu.filePath!] : Error404Page,
          handle: {
            path: menu.routePath,
            name: menu.name,
            icon: menu.icon,
            key: menu.id,
          },
        }
      }),
      {
        id: '*',
        path: '*',
        Component: Error404Page,
        handle: {
          path: '404',
          name: '404',
          key: 'Result404',
        },
      },
    ])

    setCurrentUser(currentUserDetail)
    // replace一下当前路由，为了触发路由匹配
    router.navigate(`${window.location.pathname}${window.location.search}`, {replace: true})
    setLoading(false)
  }, [data, setCurrentUser])

  return {
    loading: requestLoading || loading,
  }
}
