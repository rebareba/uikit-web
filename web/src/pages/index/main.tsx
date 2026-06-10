/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2026-06-10 21:47:40
 * @Description: 基本的使用测试
 */
import React, {useEffect} from 'react'
import './index.css'
import {useMatches, useParams} from 'react-router-dom'
import {componentPaths, modules} from '@pages/index'
import Layout from 'Uikit/Layout'
// import {useLocation, Link} from 'react-router-dom'
// import {Menu, Dropdown, Breadcrumb, Layout} from 'antd'

// import reactLog from '@assets/image/react.png'
// import logo from '@assets/svg/logo.svg'

// import style from './index.module.css'
// import styl from './index.module.styl'
// import user from './icons/user.svg' // 这个路径是被排除了所有加载不到
// import io from './io'

// console.log(remote)

type TProps = {
  // page?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Main: React.FC<TProps> = props => {
  // const a: string = props.cdc
  // 获取用户信息
  // useEffect(() => {
  //   async function getUserInfo() {
  //     const res = await io.loginInfo()
  //     console.log(res)
  //   }
  //   getUserInfo()
  // }, [])
  // 虽然路由变化了会重新执行，但是
  const matches = useMatches()
  console.log('Index matches', matches)
  const params = useParams()
  console.log('Index params', params)
  useEffect(() => {
    console.log('Index did mount')
    return () => {
      console.log('Index will unmount')
    }
  }, [])
  return (
    <Layout>
      {/* <RemoteButton name="xx" /> */}
      <h1 className="text-3xl font-bold underline pr-[2px]">Hello world!</h1>
      {componentPaths.map(path => {
        return <div key={path}>{path}</div>
      })}
      {/* <FrameTab /> */}
      <div className="bg-blue-100">
        这里测试主题切换和自定义颜色的实现使用 packages/common/theme/theme.css
        packages/common/theme/tailwind-theme-var-define.ts
        <div className="text-button-text">text-button-text</div>
        <div className="text-[var(--button-text)]">text-[var(--button-text)]</div>
      </div>
    </Layout>
  )
}

export default React.memo(Main)
