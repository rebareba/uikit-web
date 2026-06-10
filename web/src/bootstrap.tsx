import React, {Suspense, useEffect, memo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import NProgress from 'nprogress'
import {StyleProvider} from '@ant-design/cssinjs' // 解决antd样式和tailwindcss样式初始化优先级问题

import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'

import {
  App as AntdApp, // 提供重置样式和提供消费上下文的默认环境。 https://ant.design/components/app-cn
  ConfigProvider,
  ThemeConfig,
} from 'antd'

import {useSelector} from 'Uikit/Utils'
import {EventEmitterContextProvider, NProgressLoading} from 'Uikit/Components'

import {i18n} from '@utils/i18n'

import {useGlobalStore} from '@store'

import {generateDarkTheme, generateLightTheme} from '@cf/common/theme'
import RootRouterProvider from './router/provider'
import 'nprogress/nprogress.css'
import '@cf/common/theme/theme.css'
import './index.css'

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
  parent: '#root',
})

const App = () => {
  const {darkMode, lang, primaryColor} = useGlobalStore(
    useSelector(['darkMode', 'lang', 'primaryColor']),
  )
  // antd 组件库的默认主题配置
  const [curTheme, setCurTheme] = useState<ThemeConfig>(() => {
    return darkMode ? generateDarkTheme('#6193F9') : generateLightTheme('#6193F9')
  })

  // 切换主题色
  useEffect(() => {
    if (darkMode) {
      const theme = generateDarkTheme(primaryColor)
      document.body.classList.remove('light')
      document.body.classList.add('dark')
      document.body.style.backgroundColor = theme.token?.colorBgLayout || ''
      setCurTheme(theme)
    } else {
      const theme = generateLightTheme(primaryColor)
      document.body.classList.remove('dark')
      document.body.classList.add('light')
      console.log('light theme', theme)
      document.body.style.backgroundColor = theme.token?.colorBgLayout || ''
      setCurTheme(theme)
    }
  }, [darkMode, primaryColor])

  // 切换语言
  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang])

  return (
    <StyleProvider>
      <ConfigProvider theme={curTheme} locale={lang === 'zh' ? zhCN : enUS} componentSize="middle">
        <EventEmitterContextProvider>
          <Suspense fallback={<NProgressLoading />}>
            <AntdApp>
              <RootRouterProvider />
            </AntdApp>
          </Suspense>
        </EventEmitterContextProvider>
      </ConfigProvider>
    </StyleProvider>
  )
}

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(<App />)
}
