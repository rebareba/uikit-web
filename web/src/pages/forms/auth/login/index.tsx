import {useState} from 'react'
import Icon from '@ant-design/icons'

import logo from '@assets/icons/logo.svg'
import {config} from '@utils'
import ForgetPasswordModal from './components/forget-password-modal'
import LoginForm from './components/login-form'

const Login = () => {
  const [emailResetPasswordOpen, setEmailResetPasswordOpen] = useState(false)

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="flex justify-center">
        <div className="dark:bg-[rgb(33,41,70)] w-[400px] px-[32px] py-[20px] mt-[-12%] bg-white rounded-lg">
          <div className="text-center">
            <div className="flex justify-center gap-2">
              <Icon component={logo} className="text-[20px] text-primary" />
              <span className="dark:text-white text-[28px] font-bold mb-1">{config.title}</span>
            </div>
            <h3 className="dark:text-white text-[rgba(0,0,0,.45)] mb-[1em] text-[16px] font-normal">
              后台管理系统
            </h3>
          </div>
          <LoginForm
            onForgetPasswordClick={() => {
              setEmailResetPasswordOpen(true)
            }}
          />
        </div>
      </div>
      <ForgetPasswordModal open={emailResetPasswordOpen} setOpen={setEmailResetPasswordOpen} />
    </div>
  )
}

export default Login
