import React from "react"

export interface IMenu {
  key: string;
  parentKey?: React.Key | null;
  parentKeys?: React.Key[];
  routePath?: string; // 菜单点击的访问路径
  label: string;
  icon?: React.ReactNode;
  highlightIcon?: React.ReactNode;
  link?: string;    // 菜单点击的链接 是Link或者直接跳转http打开新页面
  filePath?: string; // 页面文件相对路径
  isMenu?: boolean; // 是否显示在菜单栏
  isHeader?: boolean; // 是否显示在顶部
  headerHide?: boolean; // 是否隐藏顶部菜单
  disabeld?: boolean; // 是否禁用
  showKeepAliveTab?: boolean; // 是否使用tab缓存
  scopeMenu?: boolean // 属于分类菜单
}
export type TreeMenu = IMenu & {
  parentKeys?: React.Key[]
  children?: TreeMenu[]
}


export interface TabsLayoutMethods {
  closeTab: () => void
}
