import {RouterProvider} from 'react-router-dom'

import {App} from 'antd'
import {useEffect} from 'react'
import {antdUtils} from 'Uikit/Utils'
import {router} from '.'

const RootRouterProvider = () => {
  const {notification, message, modal} = App.useApp()
  // const {currentUser} = useUserStore(useSelector('currentUser'))

  // antdUtils 全局初始化类的属性
  useEffect(() => {
    antdUtils.setMessageInstance(message)
    antdUtils.setNotificationInstance(notification)
    antdUtils.setModalInstance(modal)
  }, [notification, message, modal])

  // 路由初始化
  return <RouterProvider router={router} />
}

export default RootRouterProvider
