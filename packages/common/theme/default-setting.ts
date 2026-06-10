export interface SystemSettingType {
  title: string
  headerHeight: number
  slideWidth: number
  collapsedSlideWidth: number
  mobileMargin: number
  showKeepAliveTab: boolean
  primaryColor: string
  filterType: 'light' | 'query'
  showFormType: 'modal' | 'drawer'
  showWatermark: boolean
  watermarkPos: 'full' | 'content'
}

// 给下面代码添加备注
export const defaultSetting = {
  primaryColor: '#6193F9', // 主色调
  filterType: 'light', // 主题色模式
  showFormType: 'modal', // 表单展示方式
  showKeepAliveTab: true, // 页面切换时是否保持当前页面状态
  mobileMargin: 16, // 移动端边距
  showWatermark: true, // 是否显示水印
  watermarkPos: 'content', // 水印位置
  headerHeight: 48,
  slideWidth: 200,
  collapsedSlideWidth: 48,
} as SystemSettingType
