// 加载pages 文件夹下的所有非components文件夹下的index.tsx文件 // 默认是sync模式
export const modules = require.context(
  '../pages',
  true,
  /^(?!.*components\/).*\/index\.tsx$/,
  'sync',
)
// console.log('modules.keys()', modules.keys()) // ['./index/index.tsx']
export const componentPaths = modules.keys().map((path: string) => path.replace('./', ''))

// 自动读取pages下的目录

export const pages = modules
  .keys()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .reduce<Record<string, React.FC<any>>>((prev, path: string) => {
    // .reduce<Record<string, () => Promise<any>>>((prev, path: string) => {

    const formatPath = path.replace('./', '')

    // 这种情况下在Frame的路由中不能再次这样设置了  Component: menu.filePath ? pages[menu.filePath] ? lazy(pages[menu.filePath]) : Result404 : Result404,
    // prev[formatPath] = async () => {
    //   return modules(path)
    // }

    // 这种方式使用Component: pages['index/index.tsx'],
    prev[formatPath] = modules(path).default // 使用lazy 通过 页面自身设置懒加载
    return prev
  }, {})

console.log('componentPaths', componentPaths)
console.log('pages', pages) //  {'index/index.tsx': fn}
