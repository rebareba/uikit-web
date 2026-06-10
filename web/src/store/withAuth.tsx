// 登录权限判断高阶组件

import {Modal, Tooltip} from 'antd'
import React, {ReactNode, useEffect, useState, memo, ComponentType, ReactElement} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import type {ModalProps} from 'antd'
import {useUserStore} from '@store/user'

interface AuthOptions {
  modalProps?: Partial<ModalProps>
  customContent?: ReactNode
}

// 页面跳转登录校验
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: AuthOptions,
) => {
  const {modalProps = {}, customContent} = options || {}

  const AuthWrapper = memo((props: P) => {
    const [openLoginModal, setOpenLoginModal] = useState(false)
    const {currentUser} = useUserStore()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      if (!currentUser) {
        setOpenLoginModal(true)
      }
    }, [currentUser])

    const handleLogin = () => {
      navigate('/login', {state: {from: location.pathname}})
      setOpenLoginModal(false)
    }

    const handleCancel = () => {
      navigate(-1)
      setOpenLoginModal(false)
    }

    if (!currentUser) {
      return (
        <Modal
          title="登录提示"
          open={openLoginModal}
          onOk={handleLogin}
          onCancel={handleCancel}
          okText="去登录"
          cancelText="返回"
          maskClosable={false}
          {...modalProps}
        >
          {customContent || <p>请先登录后再继续操作</p>}
        </Modal>
      )
    }

    return <WrappedComponent {...props} />
  })

  // 处理displayName (方便React DevTools调试)
  AuthWrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return AuthWrapper
}

// 按钮登录判断
export const useAuthAction = () => {
  const {currentUser} = useUserStore()
  const navigate = useNavigate()

  const checkAuth = (action: () => void) => {
    if (currentUser) {
      action()
    } else {
      Modal.confirm({
        title: '操作提示',
        content: '该功能需要登录后使用',
        okText: '去登录',
        cancelText: '取消',
        onOk: () => navigate('/login'),
      })
    }
  }

  return {checkAuth}
}

// 类型守卫：判断是否是ReactElement
function isReactElement<P>(component: ComponentType<P> | ReactElement): component is ReactElement {
  return React.isValidElement(component)
}
type PropsWithDisabled<P> = P & {
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
}
interface WithPermissionOptions {
  /**
   * 需要的权限标识（如：'tenant:edit'）
   */
  permission: string
  /**
   * 无权限时的行为：
   * 'disable' - 禁用组件（默认）
   * 'hide' - 隐藏组件
   */
  mode?: 'disable' | 'hide'
  tooltip?: string
}

// 判断按钮权限 高阶组件 显示或者disabled
export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPermissionOptions,
) => {
  const {permission, mode = 'disable', tooltip = '无权限操作'} = options

  return function WithPermission(props: PropsWithDisabled<P>) {
    const {hasPermission} = useUserStore(state => ({
      hasPermission: state.currentUser?.permissions?.includes(permission),
    }))

    // 无权限且设置为隐藏模式
    if (!hasPermission && mode === 'hide') return null

    // 无权限且设置为禁用模式
    if (!hasPermission && mode === 'disable') {
      const {style, ...restProps} = props // 解构出style和其他props
      const disabledProps = {
        ...restProps,
        disabled: true,
        style: {...style, cursor: 'not-allowed'},
      }

      const element = isReactElement(WrappedComponent) ? (
        React.cloneElement(WrappedComponent, disabledProps)
      ) : (
        <WrappedComponent {...(disabledProps as P)} />
      )

      return <Tooltip title={tooltip}>{element}</Tooltip>
    }

    return isReactElement(WrappedComponent) ? (
      React.cloneElement(WrappedComponent, props)
    ) : (
      <WrappedComponent {...(props as P)} />
    )
  }
}

// 使用：
// const ProtectedPage = () => {
//   return <div>只有登录用户可见的内容</div>;
// };

// export default withAuth(ProtectedPage);
