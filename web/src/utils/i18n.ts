import i18n from 'i18next'
import enUS from '@assets/locales/en-US'
import zhCN from '@assets/locales/zh-CN'

i18n.init({
  resources: {
    en: {
      translation: enUS,
    },
    zh: {
      translation: zhCN,
    },
  },
  lng: 'zh',
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
})

export const t = (key: string) => {
  return i18n.t(key) || key
}

export {i18n}
