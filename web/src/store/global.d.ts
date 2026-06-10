
export interface MenuData {
  id: string
  parentId?: React.Key
  name: string
  icon?: string
  link?: string
  filePath?: string // 页面文件相对路径
  orderNumber?: number
  isMenu?: boolean // 是否显示在菜单栏
  isHeader?: boolean // 是否显示在顶部
  headerHide?: boolean // 是否隐藏在顶部
  disabeld?: boolean // 是否禁用
  // children?: Menu[];
  routePath?: string // 菜单点击的访问路径
  permission?:number
  showKeepAliveTab?: boolean // 是否使用tab缓存
}
export interface Menu {
  id: string;
  parentId?: string;
  name?: string;
  icon?: string;
  type?: number; // 1 目录 2 菜单 3 按钮 4 低代码页面
  route?: string; // react 的路由路径
  filePath?: string; // 页面文件相对路径
  orderNumber?: number;
  url?: string;
  show?: boolean; // 是否显示在菜单栏
  children?: Menu[];
  path?: string; // 菜单点击的访问路径
  parentPaths?: string[];
  authCode?: string;
  curVersion?: string;
}
export type TUserInfo = {
  userId: number // 1
  avatar: string | null
  securityLevel: number // 5 权限等级
  mobile: string // '15111111111'
  name: string | null
  nickname: string
  roleCode: string // 'master'
  ctime: string // '2021-02-25 11:52:14'
  mtime: string // '2021-08-24 16:41:45'
  roleName: string // '超级管理员'
  position: null | string
  department: null | string
  slogan: null | string
  tags: string[]
  token: null | string
  // [key: string]: any
  menus: Menu[];
  flatMenus: Menu[];
  avatarPath: string;
  authList: string[];
  menuData?: MenuData[];
  permissions: string[]
}
export enum MenuType {
  DIRECTORY = 1,
  MENU,
  BUTTON,
  LowCodePage,
}