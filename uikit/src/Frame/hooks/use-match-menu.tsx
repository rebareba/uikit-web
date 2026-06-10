import {useMemo} from 'react'
import {useLocation, useMatches, useOutlet, matchRoutes, useNavigate} from 'react-router-dom'
import {IMenu, TreeMenu} from '../frame'

export function useMatchMenu(menuData: IMenu[], defaultShowKeepAliveTab: boolean) {
  let showKeepAliveTab = defaultShowKeepAliveTab
  // 获取当前url
  const {pathname} = useLocation()
  // 按parentKey分组 {'parentKey': IMenu[], 'parentKey_2': IMenu[]}
  const menuGroup = useMemo<Record<string, IMenu[]>>(() => {
    return menuData.reduce<Record<string, IMenu[]>>((prev, menu: IMenu) => {
      if (!menu.parentKey) {
        return prev
      }

      if (!prev[`${menu.parentKey}`]) {
        prev[`${menu.parentKey}`] = []
      }

      prev[`${menu.parentKey}`].push(menu)
      return prev
    }, {})
  }, [menuData])

  const {menuTree, allRoutes} = useMemo(() => {
    const allRoutes: (TreeMenu & {path: string})[] = []
    // 生成需要的数据 主要是parentKeys 和 根据自己和父辈的showKeepAliveTab更新
    function buildTreeMenu(
      menus: IMenu[],
      menuGroup: Record<string, IMenu[]>,
      parentMenu?: IMenu,
      showKeepAliveTab?: boolean,
    ): TreeMenu[] {
      return menus.map(menu => {
        const children = menuGroup[`${menu.key}`] // 是否是
        const parentKeys = parentMenu?.parentKeys || []
        if (menu.routePath && menu.filePath) {
          allRoutes.push({
            ...menu,
            path: menu.routePath,
            parentKeys: [...parentKeys, menu.key],
            showKeepAliveTab:
              menu.showKeepAliveTab !== undefined
                ? menu.showKeepAliveTab
                : parentMenu?.showKeepAliveTab,
          })
        }
        return {
          ...menu,
          parentKeys,
          showKeepAliveTab:
            menu.showKeepAliveTab !== undefined
              ? menu.showKeepAliveTab
              : parentMenu?.showKeepAliveTab,
          children: children?.length
            ? buildTreeMenu(
                children,
                menuGroup,
                {
                  ...menu,
                  parentKeys: [...parentKeys, menu.key],
                  showKeepAliveTab:
                    menu.showKeepAliveTab !== undefined ? menu.showKeepAliveTab : showKeepAliveTab,
                },
                menu.showKeepAliveTab !== undefined ? menu.showKeepAliveTab : showKeepAliveTab,
              )
            : undefined,
        }
      })
    }
    const menuTree = buildTreeMenu(
      menuData.filter(o => !o.parentKey), // 过滤出顶级菜单
      menuGroup,
    )
    return {
      menuTree,
      allRoutes,
    }
  }, [menuGroup, menuData])

  const {headerMenu, siderMenuMap, defaultSiderMenu, headerMenuKeys} = useMemo(() => {
    function filterMenu(menu: TreeMenu[]): TreeMenu[] {
      const arr: TreeMenu[] = []
      menu.forEach(item => {
        if (item.children && item.isMenu) {
          const temp = filterMenu(item.children)
          if (temp.length > 0) {
            arr.push({...item, children: temp}) // 只需要浅拷贝
          } else if (item.isMenu) {
            arr.push({...item, children: undefined}) // 只需要浅拷贝
          }
        } else if (item.isMenu) {
          arr.push({...item})
        }
      })
      return arr
    }
    // 过滤出是菜单的
    const menu = filterMenu(menuTree)
    const headerMenuKeys: React.Key[] = []

    function formatMenu(menu: TreeMenu[]) {
      const ret: {
        headerMenu: TreeMenu[]
        siderMenuMap: Record<string, TreeMenu[]>
        siderMenu: TreeMenu[]
      } = {
        headerMenu: [],
        siderMenuMap: {},
        siderMenu: [],
      }
      menu.forEach(item => {
        if (item.isHeader) {
          headerMenuKeys.push(item.key)
          if (item.children) {
            const {headerMenu, siderMenuMap, siderMenu} = formatMenu(item.children)
            ret.siderMenuMap = {...ret.siderMenuMap, ...siderMenuMap}
            if (headerMenu.length > 0) {
              ret.headerMenu.push({
                ...item,
                children: headerMenu,
              })
            } else {
              if (siderMenu.length > 0) {
                ret.siderMenuMap = {...ret.siderMenuMap, [`${item.key}`]: siderMenu}
              }
              ret.headerMenu.push({...item, children: undefined})
            }
            // ret.headerMenu = ret.headerMenu.concat(headerMenu)
          } else {
            ret.headerMenu.push(item)
          }
        } else {
          // ret.siderMenuMap[`${item.key}`] = item
          ret.siderMenu.push(item)
        }
      })
      return ret
    }

    const {headerMenu, siderMenuMap, siderMenu: defaultSiderMenu} = formatMenu(menu)
    return {
      headerMenu,
      siderMenuMap,
      defaultSiderMenu,
      headerMenuKeys,
    }
  }, [menuTree])
  const matchedRoutes = matchRoutes(allRoutes, pathname)

  const siderMenuKeys = Object.keys(siderMenuMap)
  const matchedRoute = matchedRoutes?.slice(-1)[0].route
  const selectedKeys = matchedRoute?.parentKeys || []
  showKeepAliveTab =
    matchedRoute?.showKeepAliveTab === undefined
      ? defaultShowKeepAliveTab
      : matchedRoute?.showKeepAliveTab
  let matchedKey: string | undefined
  let siderMenu = siderMenuKeys.reduce<TreeMenu[]>((prev, key) => {
    if (prev.length > 0) return prev
    if (selectedKeys.includes(key)) {
      matchedKey = key
      return siderMenuMap[key]
    }
    return prev
  }, [])
  if (
    !siderMenu.length &&
    defaultSiderMenu.length &&
    selectedKeys.filter(key => !headerMenuKeys.includes(key)).length >= 1 // 非顶级菜单
  ) {
    matchedKey = 'frame_tab_default'
    siderMenu = defaultSiderMenu
  }
  return {
    headerMenu, // 头部的菜单
    selectedKeys: selectedKeys.map(key => `${key}`),
    siderMenu,
    matchedRoute,
    matchedKey, // 后续过滤分组使用的 目前不分组了 显示全部
    showKeepAliveTab,
  }
}
