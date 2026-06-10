import React, {useMemo} from 'react'
import {GlobalLoading} from 'Uikit/Components'
import {useGlobalStore} from '@store'
import {useUserDetail} from '@store/useUserDetail'
import Frame, {IFrameTabProps} from 'Uikit/Frame'
import {useUserStore} from '@store/user'
import config from '@utils/config'
import logo from '@assets/logo.svg'
import LangDropdown from './lang-dropdown'
import ThemeSwitcher from './theme-switcher'
import UserInfo from './user-info'

const Layout: React.FC = () => {
  const {darkMode, setDarkMode, setLang, frameCacheKey, lang} = useGlobalStore()
  const {loading} = useUserDetail()
  const {currentUser} = useUserStore()

  const userMenuData = useMemo<IFrameTabProps['menuData']>(() => {
    if (!currentUser?.menuData) return []

    return (currentUser.menuData || []).map(item => {
      return {
        ...item,
        key: item.id,
        label: item.name,
        parentKey: item.parentId,
      }
    })
  }, [currentUser?.menuData])

  if (loading) {
    return <GlobalLoading />
  }
  return (
    <Frame
      {...{
        title: config.title,
        // headerHeight: 48,
        darkMode,
        logo,
        // collapsedSlideWidth: 80,
        menuData: userMenuData,
        cackeKey: frameCacheKey,
      }}
      headerExtra={
        <div className="flex flex-row items-center justify-end gap-md flex-1 pr-md">
          <ThemeSwitcher darkMode={darkMode} setDarkMode={setDarkMode} />
          <LangDropdown lang={lang} setLang={setLang} />
          <UserInfo darkMode={darkMode} />
        </div>
      }
    />
  )
}

export default Layout
