import {theme} from 'antd'
import {create} from 'zustand'
import {devtools, persist, createJSONStorage} from 'zustand/middleware'
import {defaultSetting} from '@cf/common/theme/default-setting'
import {LocalStoragePrefix} from '@common/constant'

interface State {
  darkMode: boolean
  lang: string
  primaryColor: string
  showKeepAliveTab: boolean
  filterType: 'light' | 'query'
  token: string
  showFormType: 'drawer' | 'modal'
  showWatermark: boolean
  watermarkPos: 'full' | 'content'
  frameCacheKey: string
}

interface Action {
  setDarkMode: (darkMode: State['darkMode']) => void
  setLang: (lang: State['lang']) => void
  setPrimaryColor: (darkMode: State['primaryColor']) => void
  setShowKeepAliveTab: (collapsed: State['showKeepAliveTab']) => void
  setFilterType: (type: State['filterType']) => void
  setShowFormType: (type: State['showFormType']) => void
  setShowWatermark: (showWatermark: State['showWatermark']) => void
  setWatermarkPos: (pos: State['watermarkPos']) => void
  reset: () => void
}

export const useGlobalStore = create<State & Action>()(
  devtools(
    persist(
      set => {
        return {
          darkMode: false,
          collapsed: false,
          lang: 'zh',
          token: '',
          refreshToken: '',
          frameCacheKey: `${LocalStoragePrefix}_frame_keepAliveTabs`,
          setDarkMode: (darkMode: State['darkMode']) =>
            set({
              darkMode,
            }),
          setLang: (lang: State['lang']) =>
            set({
              lang,
            }),
          primaryColor: defaultSetting.primaryColor,
          setPrimaryColor: collapsed => set({primaryColor: collapsed}),
          showKeepAliveTab: defaultSetting.showKeepAliveTab,
          setShowKeepAliveTab: collapsed => set({showKeepAliveTab: collapsed}),
          filterType: defaultSetting.filterType,
          setFilterType: type => set({filterType: type}),
          showFormType: defaultSetting.showFormType,
          setShowFormType: type => set({showFormType: type}),
          showWatermark: defaultSetting.showWatermark,
          setShowWatermark: showWatermark => set({showWatermark}),
          watermarkPos: defaultSetting.watermarkPos,
          setWatermarkPos: pos => set({watermarkPos: pos}),
          reset: () => {
            set({
              primaryColor: defaultSetting.primaryColor,
              showKeepAliveTab: defaultSetting.showKeepAliveTab,
              filterType: defaultSetting.filterType,
              showFormType: defaultSetting.showFormType,
            })
          },
        }
      },
      {
        name: 'globalStore',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {name: 'globalStore'},
  ),
)
