declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.less'

// CSS modules
type CSSModuleClasses = {readonly [key: string]: string}

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}

declare module '*.css'
declare module '*.json'
declare module '*.styl'
interface Window {
  config: Record<string, unknown>
}

// Modal对话框 和 Drawer抽屉
interface IShowHide {
  onCancel: () => void
  onFinish?: () => void
}

